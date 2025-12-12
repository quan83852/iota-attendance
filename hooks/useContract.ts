"use client"

/**
 * ============================================================================
 * IOTA CONTRACT INTEGRATION HOOK
 * ============================================================================
 * 
 * This hook contains ALL the contract interaction logic.
 * 
 * To customize your dApp, modify the configuration section below.
 * 
 * ============================================================================
 */

import { useState, useEffect } from "react"
import {
  useCurrentAccount,
  useIotaClient,
  useSignAndExecuteTransaction,
  useIotaClientQuery,
} from "@iota/dapp-kit"
import { Transaction } from "@iota/iota-sdk/transactions"
import type { IotaObjectData } from "@iota/iota-sdk/client"

// ============================================================================
// CONTRACT CONFIGURATION
// ============================================================================
// Change these values to match your Move contract

export const PACKAGE_ID = "0xe7a4eb3db0d780f6ca5525b9e0bf12ba64220d05ef7cf13a8afc330b9cbf9bac"
export const CONTRACT_MODULE = "contract"
export const CONTRACT_METHODS = {
  CREATE_SESSION: "create_session",
  CHECK_IN: "check_in",
  GET_COUNT: "get_count",
} as const

// ============================================================================
// DATA EXTRACTION
// ============================================================================
// Modify this to extract data from your contract's object structure

function getObjectFields(data: IotaObjectData): { name: string; count: number } | null {
  if (data.content?.dataType !== "moveObject") {
    console.log("Data is not a moveObject:", data.content?.dataType)
    return null
  }
  
  const fields = data.content.fields as any
  if (!fields) {
    console.log("No fields found in object data")
    return null
  }
  
  console.log("Object fields structure:", JSON.stringify(fields, null, 2))
  
  let count: number
  if (typeof fields.count === "string") {
    count = parseInt(fields.count, 10)
    if (isNaN(count)) {
      console.log("Count is not a valid number:", fields.count)
      return null
    }
  } else if (typeof fields.count === "number") {
    count = fields.count
  } else {
    console.log("Count is not a number or string:", typeof fields.count, fields.count)
    return null
  }
  
  if (!fields.name) {
    console.log("Name field is missing")
    return null
  }
  
  let name: string
  if (Array.isArray(fields.name)) {
    name = new TextDecoder().decode(new Uint8Array(fields.name))
  } else {
    name = String(fields.name)
  }
  
  return {
    name,
    count,
  }
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export interface ContractData {
  name: string
  count: number
}

export interface ContractState {
  isLoading: boolean
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  hash: string | undefined
  error: Error | null
}

export interface ContractActions {
  createSession: (name: string) => Promise<void>
  checkIn: () => Promise<void>
  clearObject: () => void
}

export const useContract = () => {
  const currentAccount = useCurrentAccount()
  const address = currentAccount?.address
  const iotaClient = useIotaClient()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()
  const [objectId, setObjectId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hash, setHash] = useState<string | undefined>()
  const [transactionError, setTransactionError] = useState<Error | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1)
      if (hash) setObjectId(hash)
    }
  }, [])

  const { data, isPending: isFetching, error: queryError, refetch } = useIotaClientQuery(
    "getObject",
    {
      id: objectId!,
      options: { showContent: true, showOwner: true },
    },
    {
      enabled: !!objectId,
    }
  )

  const fields = data?.data ? getObjectFields(data.data) : null
  const objectExists = !!data?.data
  const hasValidData = !!fields

  const createSession = async (name: string) => {
    try {
      setIsLoading(true)
      setTransactionError(null)
      setHash(undefined)
      const tx = new Transaction()
      
      const nameBytes = new TextEncoder().encode(name)
      
      tx.moveCall({
        arguments: [tx.pure.vector("u8", Array.from(nameBytes))],
        target: `${PACKAGE_ID}::${CONTRACT_MODULE}::${CONTRACT_METHODS.CREATE_SESSION}`,
      })

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: async ({ digest }) => {
            setHash(digest)
            try {
              const { effects } = await iotaClient.waitForTransaction({
                digest,
                options: { showEffects: true },
              })
              const newObjectId = effects?.created?.[0]?.reference?.objectId
              if (newObjectId) {
                setObjectId(newObjectId)
                if (typeof window !== "undefined") {
                  window.location.hash = newObjectId
                }
                setIsLoading(false)
              } else {
                setIsLoading(false)
                console.warn("No object ID found in transaction effects")
              }
            } catch (waitError) {
              console.error("Error waiting for transaction:", waitError)
              setIsLoading(false)
            }
          },
          onError: (err) => {
            const error = err instanceof Error ? err : new Error(String(err))
            setTransactionError(error)
            console.error("Error:", err)
            setIsLoading(false)
          },
        }
      )
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setTransactionError(error)
      console.error("Error creating session:", err)
      setIsLoading(false)
    }
  }

  const checkIn = async () => {
    if (!objectId) return

    try {
      setIsLoading(true)
      setTransactionError(null)
      const tx = new Transaction()
      tx.moveCall({
        arguments: [tx.object(objectId)],
        target: `${PACKAGE_ID}::${CONTRACT_MODULE}::${CONTRACT_METHODS.CHECK_IN}`,
      })

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: async ({ digest }) => {
            setHash(digest)
            await iotaClient.waitForTransaction({ digest })
            await refetch()
            setIsLoading(false)
          },
          onError: (err) => {
            const error = err instanceof Error ? err : new Error(String(err))
            setTransactionError(error)
            console.error("Error:", err)
            setIsLoading(false)
          },
        }
      )
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setTransactionError(error)
      console.error("Error checking in:", err)
      setIsLoading(false)
    }
  }

  const contractData: ContractData | null = fields
    ? {
        name: fields.name,
        count: fields.count,
      }
    : null

  const clearObject = () => {
    setObjectId(null)
    setTransactionError(null)
    if (typeof window !== "undefined") {
      window.location.hash = ""
    }
  }

  const actions: ContractActions = {
    createSession,
    checkIn,
    clearObject,
  }

  const contractState: ContractState = {
    isLoading: (isLoading && !objectId) || isPending || isFetching,
    isPending,
    isConfirming: false,
    isConfirmed: !!hash && !isLoading && !isPending,
    hash,
    error: queryError || transactionError,
  }

  return {
    data: contractData,
    actions,
    state: contractState,
    objectId,
    objectExists,
    hasValidData,
  }
}