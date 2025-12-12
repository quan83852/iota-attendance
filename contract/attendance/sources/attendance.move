module attendance::contract {
    use iota::tx_context::TxContext;
    use iota::object;
    use iota::transfer;

    public struct Attendance has key {
        id: UID,
        name: vector<u8>,
        count: u64,
    }

    public struct Checkin has key {
        id: UID,
        user: address,
    }

    /// Create new attendance session
    public entry fun create_session(name: vector<u8>, ctx: &mut TxContext) {
        let session = Attendance {
            id: object::new(ctx),
            name,
            count: 0,
        };
        transfer::share_object(session);
    }

    /// User check-in
    public entry fun check_in(session: &mut Attendance, ctx: &mut TxContext) {
        let record = Checkin {
            id: object::new(ctx),
            user: ctx.sender(),
        };
        session.count = session.count + 1;
        transfer::share_object(record);
    }

    public fun get_count(session: &Attendance): u64 {
        session.count
    }
}
