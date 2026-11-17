/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it, vi } from 'vitest'

import { api } from '@/lib/api'

import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from '../sign-in/components/user-auth-form'

async function renderLogin(variant: 'default' | 'portal') {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  client.setQueryData(['status'], {
    password_login_enabled: true,
    register_enabled: false,
  })
  vi.spyOn(api, 'get').mockResolvedValue({ data: { success: true, data: {} } })
  const route = createRootRoute({
    component: () => (
      <AuthLayout variant={variant}>
        <UserAuthForm />
      </AuthLayout>
    ),
  })
  const router = createRouter({
    routeTree: route,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  await router.load()
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

it('portal layout gives the real login form its own landmark and keeps account help visible', async () => {
  await renderLogin('portal')
  const main = await screen.findByRole('main')
  expect(within(main).getByLabelText('Username or Email')).toBeVisible()
  expect(
    within(main).getByLabelText('Password', { exact: true })
  ).toHaveAttribute('autocomplete', 'current-password')
  expect(
    screen.getByRole('complementary', { name: 'Stay connected. Stay focused.' })
  ).toBeVisible()
  expect(
    within(main).getByRole('link', { name: 'Need help signing in?' })
  ).toHaveAttribute('href', 'https://www.sparkdancer.com/support/')
})

it('portal layout keeps keyboard access and the existing show-password control', async () => {
  const user = userEvent.setup()
  await renderLogin('portal')
  const username = await screen.findByLabelText('Username or Email')
  username.focus()
  await user.tab()
  const password = screen.getByLabelText('Password', { exact: true })
  expect(password).toHaveFocus()
  expect(password).toHaveAttribute('type', 'password')
  await user.click(screen.getByRole('button', { name: 'Show password' }))
  expect(password).toHaveAttribute('type', 'text')
})

it('default auth layout retains the form without the portal marketing panel', async () => {
  await renderLogin('default')
  expect(await screen.findByLabelText('Username or Email')).toBeVisible()
  expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  expect(
    screen.queryByRole('link', { name: 'Need help signing in?' })
  ).not.toBeInTheDocument()
})
