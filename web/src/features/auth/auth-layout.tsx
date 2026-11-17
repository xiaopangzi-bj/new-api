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
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { useSystemConfig } from '@/hooks/use-system-config'
import { cn } from '@/lib/utils'

import '@/styles/sparkdancer-account.css'

type AuthLayoutProps = {
  children: React.ReactNode
  variant?: 'default' | 'portal'
}

export function AuthLayout(props: AuthLayoutProps) {
  const { t } = useTranslation()
  const { systemName, logo, loading } = useSystemConfig()

  return (
    <div
      className={cn(
        'relative grid h-svh max-w-none',
        props.variant === 'portal' && 'sd-auth-shell'
      )}
    >
      <Link
        to='/'
        className='sd-auth-brand absolute top-4 left-4 z-10 flex items-center gap-2 transition-opacity hover:opacity-80 sm:top-8 sm:left-8'
      >
        <div className='relative h-8 w-8'>
          {loading ? (
            <Skeleton className='absolute inset-0 rounded-full' />
          ) : (
            <img
              src={logo}
              alt={t('Logo')}
              className='h-8 w-8 rounded-full object-cover'
            />
          )}
        </div>
        {loading ? (
          <Skeleton className='h-6 w-24' />
        ) : (
          <h1 className='text-xl font-medium'>{systemName}</h1>
        )}
      </Link>
      {props.variant === 'portal' && (
        <aside className='sd-auth-story' aria-labelledby='sd-auth-story-title'>
          <div className='sd-auth-story-content'>
            <img
              className='sd-auth-mark'
              src={logo}
              alt=''
              width={120}
              height={120}
            />
            <h2 id='sd-auth-story-title'>
              {t('Stay connected. Stay focused.')}
            </h2>
            <p>
              {t(
                'Your model access, balance and usage, together in one place.'
              )}
            </p>
          </div>
          <p className='sd-auth-signature'>
            SparkDancer <span>Make it easy</span>
          </p>
        </aside>
      )}
      <main
        className={
          props.variant === 'portal'
            ? 'sd-auth-main'
            : 'container flex items-center pt-16 sm:pt-0'
        }
      >
        <div
          className={cn(
            'mx-auto flex w-full flex-col justify-center space-y-2 px-4 py-8 sm:w-[480px] sm:p-8',
            props.variant === 'portal' && 'sd-auth-form'
          )}
        >
          {props.children}
        </div>
        {props.variant === 'portal' && (
          <footer className='sd-auth-help'>
            <a href='https://www.sparkdancer.com/support/'>
              {t('Need help signing in?')}
            </a>
            <span>{t('Model service account')}</span>
          </footer>
        )}
      </main>
    </div>
  )
}
