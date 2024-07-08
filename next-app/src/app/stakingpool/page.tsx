"use client";

import StakingPoolCard from "./StakePool";

export default function StakingPool() {
    return (
        <section className="w-full h-screen flex items-center justify-center">
            <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
                <StakingPoolCard />
            </div>
        </section>
    );
}
