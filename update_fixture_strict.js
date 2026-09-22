const fs = require('fs');

let code = fs.readFileSync('src/modules/portal/home/components/fixture-section.tsx', 'utf-8');

// Add import if not exists
if (!code.includes('import { NextMatchCountdown }')) {
  code = code.replace(
    'import type { PublicFixture } from "../actions/fixture.action";',
    'import type { PublicFixture } from "../actions/fixture.action";\nimport { NextMatchCountdown } from "./next-match-countdown";'
  );
}

const oldSection = `<section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h2 className="font-heading text-4xl font-700 uppercase tracking-tight text-oxford sm:text-5xl">
          Fixture
        </h2>
      </div>`;

const newSection = `<section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-10">
        {(() => {
          const upcomingMatches = initialFixtures
            .filter((m) => m.status === "SCHEDULED")
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          const nextMatch = upcomingMatches[0];
          return nextMatch ? <NextMatchCountdown match={nextMatch} /> : null;
        })()}
        
        <h2 className="font-heading text-4xl font-700 uppercase tracking-tight text-oxford sm:text-5xl">
          Fixture
        </h2>
      </div>`;

code = code.replace(oldSection, newSection);
fs.writeFileSync('src/modules/portal/home/components/fixture-section.tsx', code);
console.log("Updated fixture-section.tsx");
