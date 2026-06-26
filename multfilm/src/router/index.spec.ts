import { describe, expect, it } from 'vitest'

import router from './index'

describe('router', () => {
  it('contains the To See route', () => {
    const route = router.getRoutes().find((route) => route.path === '/seen')

    expect(route?.name).toBe('seen')
  })
})
