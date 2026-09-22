const fs = require('fs');

let code = fs.readFileSync('src/modules/portal/home/components/fixture-section.tsx', 'utf-8');

if (!code.includes('NextMatchCountdown')) {
  // Add import
  code = code.replace(
    'import type { PublicFixture } from "../actions/fixture.action";',
    'import type { PublicFixture } from "../actions/fixture.action";\nimport { NextMatchCountdown } from "./next-match-countdown";'
  );

  // Determine the next match
  // The next match is the one that has status "SCHEDULED" or "RESCHEDULED" and is the closest in the future.
  // Wait, I can just do this logic inside the component.
  
  const oldReturn = `    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h2 className="font-heading text-4xl font-700 uppercase tracking-tight text-oxford sm:text-5xl">
          Fixture
        </h2>
      </div>`;

  const newReturn = `    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-10">
        {(() => {
          const upcomingMatches = initialFixtures
            .filter((m) => m.status === "SCHEDULED" || m.status === "RESCHEDULED")
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          const nextMatch = upcomingMatches[0];
          return nextMatch ? <NextMatchCountdown match={nextMatch} /> : null;
        })()}
        
        <h2 className="font-heading text-4xl font-700 uppercase tracking-tight text-oxford sm:text-5xl">
          Fixture
        </h2>
      </div>`;

  code = code.replace(oldReturn, newReturn);
  fs.writeFileSync('src/modules/portal/home/components/fixture-section.tsx', code);
  console.log("Updated fixture-section.tsx");
} else {
  console.log("fixture-section.tsx already has NextMatchCountdown");
}
