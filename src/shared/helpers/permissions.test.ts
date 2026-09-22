import {
  hasRequiredPermissions,
  getAllowedChildRoutes,
  getFirstAllowedChildRoute,
  filterNavigation,
} from './permissions';
import { NavigationConfig } from '@/config/navigation';
import assert from 'assert';

const mockNavigation: NavigationConfig[] = [
  {
    id: 'accounting',
    label: 'Contabilidad',
    href: 'accounting',
    entryStrategy: 'firstAllowedChild',
    requiredPermissions: { anyOf: ['READ_ACCOUNT_CHARGES', 'READ_TRANSACTIONS', 'READ_ACCOUNT_CATEGORIES'] },
    routes: [
      { id: 'accounting-dashboard', href: '/admin/accounting/dashboard', showInTabs: true, requiredPermissions: { anyOf: ['READ_ACCOUNT_CHARGES', 'READ_TRANSACTIONS'] } },
      { id: 'accounting-categories', href: '/admin/accounting/categories', showInTabs: true, requiredPermissions: { anyOf: ['READ_ACCOUNT_CATEGORIES'] } },
    ],
  },
  {
    id: 'memberships',
    label: 'Membresías',
    href: 'memberships',
    entryStrategy: 'firstAllowedChild',
    requiredPermissions: { anyOf: ['READ_PLAYER_MEMBERSHIPS', 'READ_STUDENT_MEMBERSHIPS'] },
    routes: [
      { id: 'memberships-players', href: '/admin/memberships/player-memberships', showInTabs: true, requiredPermissions: { anyOf: ['READ_PLAYER_MEMBERSHIPS'] } },
      { id: 'memberships-students', href: '/admin/memberships/student-memberships', showInTabs: true, requiredPermissions: { anyOf: ['READ_STUDENT_MEMBERSHIPS'] } },
    ],
  },
  {
    id: 'web',
    label: 'Web',
    href: 'web',
    entryStrategy: 'firstAllowedChild',
    requiredPermissions: { anyOf: ['MANAGE_WEB', 'READ_NEWS'] },
    routes: [
      { id: 'web-news', href: '/admin/web/news', showInTabs: true, requiredPermissions: { anyOf: ['READ_NEWS'] } },
      { id: 'web-banners', href: '/admin/web/hero-banners', showInTabs: true, requiredPermissions: { anyOf: ['MANAGE_WEB'] } },
    ],
  },
  {
    id: 'quick-operations',
    label: 'Operaciones',
    href: 'quick-operations',
    entryStrategy: 'self',
    requiredPermissions: { anyOf: ['READ_PERSONS'] },
    routes: [
      { id: 'quick-ops-person', href: '/admin/quick-operations/[personId]', showInTabs: false, requiredPermissions: { anyOf: ['READ_PERSONS'] } },
      { id: 'quick-ops-cash', href: '/admin/quick-operations/cash-flow', showInTabs: true, requiredPermissions: { anyOf: ['READ_TRANSACTIONS'] } },
    ],
  },
];

let passCount = 0;
let totalCount = 0;

function test(name: string, fn: () => void) {
  totalCount++;
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passCount++;
  } catch (error) {
    console.error(`❌ FAIL: ${name}`);
    console.error(error);
  }
}

console.log('\n--- Running Smart Navigation Resolution Tests ---\n');

test('hasRequiredPermissions validates correctly', () => {
  assert.strictEqual(hasRequiredPermissions(['ANY'], undefined), true);
  assert.strictEqual(hasRequiredPermissions(['READ_NEWS'], { anyOf: ['READ_NEWS', 'MANAGE_WEB'] }), true);
  assert.strictEqual(hasRequiredPermissions(['OTHER'], { anyOf: ['READ_NEWS', 'MANAGE_WEB'] }), false);
});

test('getAllowedChildRoutes handles unknown module', () => {
  assert.deepStrictEqual(getAllowedChildRoutes('unknown-module', ['READ_NEWS'], mockNavigation), []);
});

test('getAllowedChildRoutes filters correctly (first denied / second allowed)', () => {
  const routes = getAllowedChildRoutes('accounting', ['READ_ACCOUNT_CATEGORIES'], mockNavigation);
  assert.strictEqual(routes.length, 1);
  assert.strictEqual(routes[0].id, 'accounting-categories');
});

test('getAllowedChildRoutes handles none allowed', () => {
  const routes = getAllowedChildRoutes('accounting', ['OTHER_PERM'], mockNavigation);
  assert.strictEqual(routes.length, 0);
});

test('getAllowedChildRoutes returns all permitted', () => {
  const routes = getAllowedChildRoutes('accounting', ['READ_ACCOUNT_CHARGES', 'READ_ACCOUNT_CATEGORIES'], mockNavigation);
  assert.strictEqual(routes.length, 2);
});

test('getFirstAllowedChildRoute returns correct child', () => {
  assert.strictEqual(getFirstAllowedChildRoute('unknown-module', ['READ_NEWS'], mockNavigation), undefined);
  assert.strictEqual(getFirstAllowedChildRoute('accounting', ['OTHER_PERM'], mockNavigation), undefined);
  assert.strictEqual(getFirstAllowedChildRoute('accounting', ['READ_ACCOUNT_CATEGORIES'], mockNavigation)?.id, 'accounting-categories');
  assert.strictEqual(getFirstAllowedChildRoute('memberships', ['READ_STUDENT_MEMBERSHIPS'], mockNavigation)?.id, 'memberships-students');
  assert.strictEqual(getFirstAllowedChildRoute('memberships', ['READ_PLAYER_MEMBERSHIPS'], mockNavigation)?.id, 'memberships-players');
  assert.strictEqual(getFirstAllowedChildRoute('web', ['READ_NEWS'], mockNavigation)?.id, 'web-news');
});

test('filterNavigation resolves entryStrategy=firstAllowedChild', () => {
  const result = filterNavigation(mockNavigation, ['READ_ACCOUNT_CATEGORIES']);
  const acc = result.find(r => r.id === 'accounting');
  assert.strictEqual(acc?.href, 'accounting/categories'); // Should be stripped of /admin/
});

test('filterNavigation hides parent if firstAllowedChild has no children allowed', () => {
  const resultNoPerms = filterNavigation(mockNavigation, []);
  assert.strictEqual(resultNoPerms.find(r => r.id === 'accounting'), undefined);
});

test('filterNavigation resolves entryStrategy=self', () => {
  const result = filterNavigation(mockNavigation, ['READ_PERSONS']);
  const ops = result.find(r => r.id === 'quick-operations');
  assert.strictEqual(ops?.href, 'quick-operations'); // Maintains self route
});

test('filterNavigation ensures config immutability', () => {
  const configSnapshot = JSON.stringify(mockNavigation);
  
  const userA = filterNavigation(mockNavigation, ['READ_ACCOUNT_CATEGORIES']);
  assert.strictEqual(userA.find(r => r.id === 'accounting')?.href, 'accounting/categories');

  const userB = filterNavigation(mockNavigation, ['READ_ACCOUNT_CHARGES']);
  assert.strictEqual(userB.find(r => r.id === 'accounting')?.href, 'accounting/dashboard');

  assert.strictEqual(JSON.stringify(mockNavigation), configSnapshot);
});

console.log(`\nResults: PASS ${passCount}/${totalCount}`);
if (passCount !== totalCount) {
  process.exit(1);
}
