class Pay {
    ResetPay() {
        return {
            type: "UNSET_PAY",
        }
    }

    SavePay(price, bank, code) {
        return {
            type: "SAVE_PAY",
            payload: { price, bank, code },
        }
    }
}

export default new Pay()
