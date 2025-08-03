"use client";

import { ContractInput } from "~~/app/debug/_components/contract";

export const StakingInput = () => {
    return <ContractInput
        key={key}
        setForm={updatedFormValue => {
            setDisplayedTxResult(undefined);
            setForm(updatedFormValue);
        }}
        form={form}
        stateObjectKey={key}
        paramType={input}
    />
}