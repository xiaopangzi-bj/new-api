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
import { Link2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { SectionPageLayout } from '@/components/layout/components/section-page-layout'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { TitledCard } from '@/components/ui/titled-card'
import { useProfile } from '@/features/profile/hooks/use-profile'

import '@/styles/sparkdancer-account.css'

import { AccessTokensCard } from './components/access-tokens-card'
import { AccountActionCard } from './components/account-action-card'
import { AccountBindings } from './components/account-bindings'
import { LoginSessionsCard } from './components/login-sessions-card'
import { PasskeyCard } from './components/passkey-card'
import { PrivacyCard } from './components/privacy-card'
import { TwoFACard } from './components/two-fa-card'

export function Security() {
  const { t } = useTranslation()
  const { profile, loading, refreshProfile, fetchProfile } = useProfile()

  let content: ReactNode
  if (loading) {
    content = (
      <div role='status' aria-label={t('Loading...')} className='space-y-4'>
        <Skeleton className='h-28 w-full' />
        <Skeleton className='h-52 w-full' />
        <Skeleton className='h-52 w-full' />
      </div>
    )
  } else if (!profile) {
    content = (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{t('Failed to load profile')}</EmptyTitle>
          <EmptyDescription>
            {t('Refresh the list and try again.')}
          </EmptyDescription>
        </EmptyHeader>
        <Button
          type='button'
          variant='outline'
          onClick={() => void fetchProfile()}
        >
          {t('Retry')}
        </Button>
      </Empty>
    )
  } else {
    content = (
      <div className='sd-security-page'>
        <div className='sd-security-intro'>
          <p>
            {t(
              'Manage how you sign in and which devices can access your account.'
            )}
          </p>
          <a href='https://www.sparkdancer.com/support/'>
            {t('Security help')}
          </a>
        </div>
        <section
          aria-labelledby='security-verification'
          className='sd-security-verification'
        >
          <div className='sd-security-section-head'>
            <h3 id='security-verification'>{t('Security verification')}</h3>
            <p>
              {t('Protect your account with a second verification method.')}
            </p>
          </div>
          <div className='sd-security-factors'>
            <TwoFACard loading={loading} />
            <PasskeyCard loading={loading} />
          </div>
        </section>
        <div className='sd-security-columns'>
          <div className='sd-security-stack'>
            <section
              aria-labelledby='security-authentication'
              className='sd-security-section space-y-3'
            >
              <h3 id='security-authentication'>
                {t('Login & Authentication')}
              </h3>
              <AccountActionCard
                action='password'
                username={profile.username}
                hasPassword={profile.has_password}
                onUpdate={refreshProfile}
              />
              <TitledCard
                title={t('Account Bindings')}
                icon={<Link2 className='size-4' />}
                headerClassName='px-3 py-2.5 !pb-2.5 sm:px-4 sm:py-2.5 sm:!pb-2.5'
                contentClassName='p-3 sm:p-3'
                titleClassName='text-sm sm:text-sm'
                iconClassName='size-7 sm:size-7'
                disableHoverEffect
              >
                <AccountBindings profile={profile} onUpdate={refreshProfile} />
              </TitledCard>
            </section>
            <section
              aria-labelledby='security-access'
              className='sd-security-section space-y-4'
            >
              <h3 id='security-access'>{t('Sessions & Access')}</h3>
              <LoginSessionsCard />
              <AccessTokensCard />
            </section>
          </div>
          <aside
            aria-labelledby='security-privacy'
            className='sd-security-stack'
          >
            <section className='sd-security-section space-y-4'>
              <h3 id='security-privacy'>{t('Privacy')}</h3>
              <PrivacyCard profile={profile} onUpdate={refreshProfile} />
            </section>
            <div className='sd-security-section'>
              <h3>{t('Keep your recovery codes safe')}</h3>
              <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
                {t(
                  'Store recovery codes separately from your phone so you can regain access if it is lost.'
                )}
              </p>
            </div>
          </aside>
        </div>
        <section
          aria-labelledby='security-account'
          className='sd-security-section sd-security-danger space-y-4'
        >
          <h3 id='security-account'>{t('Account Actions')}</h3>
          <AccountActionCard action='delete' username={profile.username} />
        </section>
      </div>
    )
  }

  return (
    <SectionPageLayout>
      <SectionPageLayout.Title>
        {t('Security & Access')}
      </SectionPageLayout.Title>
      <SectionPageLayout.Content>
        <div className='mx-auto w-full max-w-7xl'>{content}</div>
      </SectionPageLayout.Content>
    </SectionPageLayout>
  )
}
