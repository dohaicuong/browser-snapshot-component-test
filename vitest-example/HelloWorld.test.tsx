import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { server, page, userEvent } from '@vitest/browser/context'

import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

import HelloWorld from './HelloWorld'

test('renders name', async () => {
  await page.viewport(500, 300)

  render(<HelloWorld name="Vitest" />)

  const { success, result, error } = await readFile('./__screenshots__/HelloWorld.test.tsx/renders-name-1.png', 'base64')
  if (!success && error.code === 'ENOENT') {
    return await page.screenshot({ path: 'renders-name-1.png' })
  }
  const snapshotBuffer = Buffer.from(result, 'base64')
  const snapshotPng = PNG.sync.read(snapshotBuffer)
  
  const newSnapshotPath = await page.screenshot({ path: 'renders-name-1.__temp__.png' })
  const newSnapshot = await server.commands.readFile(newSnapshotPath, 'base64')
  const newSnapshotBuffer = Buffer.from(newSnapshot, 'base64')
  const newSnapshotPng = PNG.sync.read(newSnapshotBuffer)
  
  const { width, height } = snapshotPng
  const diffSnapshotPng = new PNG({ width, height })
  
  const diffPixels = pixelmatch(snapshotPng.data, newSnapshotPng.data, diffSnapshotPng.data, width, height)
  if (diffPixels > 0) {
    await server.commands.writeFile(
      './__screenshots__/HelloWorld.test.tsx/renders-name-1.__diff__.png',
      PNG.sync.write(diffSnapshotPng).toString('base64'),
      { encoding: 'base64' }
    )
  }
})

// read snapshot
  // no snapshot -> take screenshot -> write -> end
  // yes snapshot -> take screenshot -> compare pixel
    // no over_diff_threshold -> write -> end
    // yes over_diff_threshold -> write diff -> throw error

const readFile = async (...args: Parameters<typeof server.commands.readFile>) => {
  try {
    return {
      success: true as const,
      result: await server.commands.readFile(...args)
    }
  }
  catch(error) {
    return {
      success: false as const,
      error: error as {
        code: string
        message: string
        errno?: number
        path?: string
        stack?: string
      }
    }
  }
}
