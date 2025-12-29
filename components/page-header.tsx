import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  badge?: string
}

export function PageHeader({ title, description, action, badge }: PageHeaderProps) {
  return (
    <div className="mb-10 lg:mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="h1 text-emerald-900">
              {title}
            </h1>
            {badge && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-base md:text-lg text-emerald-700 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  )
}

