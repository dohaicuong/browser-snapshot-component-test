process.cwd = () => '/'
process.nextTick = () => null

import { expect } from 'vitest'
// import { toMatchImageSnapshot } from 'jest-image-snapshot'

// expect.extend({ toMatchImageSnapshot })
