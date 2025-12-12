"use client"

/**
 * ============================================================================
 * IOTA DAPP INTEGRATION COMPONENT
 * ============================================================================
 * 
 * This is the main integration component for your IOTA dApp.
 * 
 * All the contract logic is in hooks/useContract.ts
 * 
 * To customize your dApp, modify this file.
 * 
 * ============================================================================
 */

import { useCurrentAccount } from "@iota/dapp-kit"
import { useContract } from "@/hooks/useContract"
import { Button, Container, Flex, Heading, Text, TextField } from "@radix-ui/themes"
import ClipLoader from "react-spinners/ClipLoader"
import { useState } from "react"

const SampleIntegration = () => {
  const currentAccount = useCurrentAccount()
  const { data, actions, state, objectId, objectExists, hasValidData } = useContract()
  const [sessionName, setSessionName] = useState("")
  
  const isConnected = !!currentAccount

  if (!isConnected) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ maxWidth: "500px", width: "100%" }}>
          <Heading size="6" style={{ marginBottom: "1rem" }}>IOTA Attendance dApp</Heading>
          <Text>Please connect your wallet to interact with the contract.</Text>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", padding: "1rem", background: "var(--gray-a2)" }}>
      <Container style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Heading size="6" style={{ marginBottom: "2rem" }}>IOTA Attendance dApp</Heading>

        {!objectId ? (
          <div>
            <TextField.Root
              placeholder="Enter session name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              size="3"
              style={{ marginBottom: "1rem" }}
            />
            <Button
              size="3"
              onClick={() => actions.createSession(sessionName)}
              disabled={state.isPending || !sessionName.trim()}
            >
              {state.isPending ? (
                <>
                  <ClipLoader size={16} style={{ marginRight: "8px" }} />
                  Creating...
                </>
              ) : (
                "Create Session"
              )}
            </Button>
            {state.error && (
              <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--red-a3)", borderRadius: "8px" }}>
                <Text style={{ color: "var(--red-11)" }}>
                  Error: {(state.error as Error)?.message || String(state.error)}
                </Text>
              </div>
            )}
          </div>
        ) : (
          <div>
            {state.isLoading && !data ? (
              <Text>Loading session...</Text>
            ) : state.error ? (
              <div style={{ padding: "1rem", background: "var(--red-a3)", borderRadius: "8px" }}>
                <Text style={{ color: "var(--red-11)", display: "block", marginBottom: "0.5rem" }}>
                  Error loading session
                </Text>
                <Text size="2" style={{ color: "var(--red-11)" }}>
                  {state.error.message || "Session not found or invalid"}
                </Text>
                <Text size="1" style={{ color: "var(--gray-a11)", marginTop: "0.5rem", display: "block" }}>
                  Session ID: {objectId}
                </Text>
                <Button
                  size="2"
                  variant="soft"
                  onClick={actions.clearObject}
                  style={{ marginTop: "1rem" }}
                >
                  Clear & Create New
                </Button>
              </div>
            ) : objectExists && !hasValidData ? (
              <div style={{ padding: "1rem", background: "var(--yellow-a3)", borderRadius: "8px" }}>
                <Text style={{ color: "var(--yellow-11)" }}>
                  Session found but data structure is invalid. Please check the contract structure.
                </Text>
                <Text size="1" style={{ color: "var(--gray-a11)", marginTop: "0.5rem", display: "block" }}>
                  Session ID: {objectId}
                </Text>
              </div>
            ) : data ? (
              <div>
                <div style={{ marginBottom: "1rem", padding: "1rem", background: "var(--gray-a3)", borderRadius: "8px" }}>
                  <Text size="2" style={{ display: "block", marginBottom: "0.5rem" }}>Session Name</Text>
                  <Heading size="6" style={{ marginBottom: "1rem" }}>{data.name}</Heading>
                  <Text size="2" style={{ display: "block", marginBottom: "0.5rem" }}>Attendance Count</Text>
                  <Heading size="8">{data.count}</Heading>
                  <Text size="1" style={{ color: "var(--gray-a11)", marginTop: "0.5rem", display: "block" }}>
                    Session ID: {objectId}
                  </Text>
                </div>

                <Flex gap="2" style={{ marginBottom: "1rem" }}>
                  <Button
                    onClick={actions.checkIn}
                    disabled={state.isLoading || state.isPending}
                  >
                    {state.isLoading || state.isPending ? (
                      <ClipLoader size={16} />
                    ) : (
                      "Check In"
                    )}
                  </Button>
                </Flex>

                {state.hash && (
                  <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--gray-a3)", borderRadius: "8px" }}>
                    <Text size="1" style={{ display: "block", marginBottom: "0.5rem" }}>Transaction Hash</Text>
                    <Text size="2" style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{state.hash}</Text>
                    {state.isConfirmed && (
                      <Text size="2" style={{ color: "green", marginTop: "0.5rem", display: "block" }}>
                        Transaction confirmed!
                      </Text>
                    )}
                  </div>
                )}

                {state.error && (
                  <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--red-a3)", borderRadius: "8px" }}>
                    <Text style={{ color: "var(--red-11)" }}>
                      Error: {(state.error as Error)?.message || String(state.error)}
                    </Text>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: "1rem", background: "var(--yellow-a3)", borderRadius: "8px" }}>
                <Text style={{ color: "var(--yellow-11)" }}>Session not found</Text>
                <Text size="1" style={{ color: "var(--gray-a11)", marginTop: "0.5rem", display: "block" }}>
                  Session ID: {objectId}
                </Text>
                <Button
                  size="2"
                  variant="soft"
                  onClick={actions.clearObject}
                  style={{ marginTop: "1rem" }}
                >
                  Clear & Create New
                </Button>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}

export default SampleIntegration