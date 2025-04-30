export const useMenuData = () => {
  return {
    sections: [
      {
        title: 'Core',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
            path: '/app/dashboard'
          }
        ]
      },
      {
        title: 'Events',
        items: [
          {
            label: 'Events',
            icon: 'pi pi-calendar',
            path: '/app/events',
            submenu: [
              { label: 'All Events', path: '/app/events' },
              { label: 'Create New', path: '/app/events/new' },
              { label: 'Calendar View', path: '/app/events/calendar' }
            ]
          },
          {
            label: 'Tickets',
            icon: 'pi pi-ticket',
            path: '/app/tickets',
            submenu: [
              { label: 'Orders', path: '/app/tickets/orders' },
              { label: 'Pricing', path: '/app/tickets/pricing' },
              { label: 'Refunds', path: '/app/tickets/refunds' }
            ]
          },
          {
            label: 'Programs',
            icon: 'pi pi-book',
            path: '/app/programs',
            submenu: [
              { label: 'All Programs', path: '/app/programs' },
              { label: 'Templates', path: '/app/programs/templates' }
            ]
          },
          {
            label: 'Venues',
            icon: 'pi pi-map-marker',
            path: '/app/venues',
            submenu: [
              { label: 'Venues List', path: '/app/venues' },
              { label: 'Seating Charts', path: '/app/venues/seating' }
            ]
          }
        ]
      },
      {
        title: 'People',
        items: [
          {
            label: 'Volunteers',
            icon: 'pi pi-users',
            path: '/app/volunteers',
            submenu: [
              { label: 'Positions', path: '/app/volunteers/positions' },
              { label: 'Sign-ups', path: '/app/volunteers/signups' },
              { label: 'Schedule', path: '/app/volunteers/schedule' }
            ]
          },
          {
            label: 'Team',
            icon: 'pi pi-user-plus',
            path: '/app/team',
            submenu: [
              { label: 'Members', path: '/app/team/members' },
              { label: 'Roles', path: '/app/team/roles' },
              { label: 'Permissions', path: '/app/team/permissions' }
            ]
          }
        ]
      },
      {
        title: 'Marketing',
        items: [
          {
            label: 'Communications',
            icon: 'pi pi-send',
            path: '/app/communications',
            submenu: [
              { label: 'Email Templates', path: '/app/communications/emails' },
              { label: 'Announcements', path: '/app/communications/announcements' },
              { label: 'Notifications', path: '/app/communications/notifications' }
            ]
          },
          {
            label: 'Website',
            icon: 'pi pi-globe',
            path: '/app/website',
            submenu: [
              { label: 'Pages', path: '/app/website/pages' },
              { label: 'Navigation', path: '/app/website/navigation' },
              { label: 'Custom Domain', path: '/app/website/domain' }
            ]
          }
        ]
      },
      {
        title: 'Analytics',
        items: [
          {
            label: 'Reports',
            icon: 'pi pi-chart-bar',
            path: '/app/analytics',
            submenu: [
              { label: 'Sales', path: '/app/analytics/sales' },
              { label: 'Attendance', path: '/app/analytics/attendance' },
              { label: 'Volunteers', path: '/app/analytics/volunteers' }
            ]
          },
          {
            label: 'Financial',
            icon: 'pi pi-dollar',
            path: '/app/financial',
            submenu: [
              { label: 'Revenue', path: '/app/financial/revenue' },
              { label: 'Transactions', path: '/app/financial/transactions' },
              { label: 'Payouts', path: '/app/financial/payouts' }
            ]
          }
        ]
      },
      {
        title: 'Settings',
        items: [
          {
            label: 'Studio Settings',
            icon: 'pi pi-cog',
            path: '/app/settings',
            submenu: [
              { label: 'Profile', path: '/app/settings/profile' },
              { label: 'Team', path: '/app/settings/team' },
              { label: 'Notifications', path: '/app/settings/notifications' }
            ]
          },
          {
            label: 'Branding',
            icon: 'pi pi-palette',
            path: '/app/settings/branding',
            submenu: [
              { label: 'Colors & Logo', path: '/app/settings/branding' },
              { label: 'Templates', path: '/app/settings/templates' },
              { label: 'Forms', path: '/app/settings/forms' }
            ]
          },
          {
            label: 'Billing',
            icon: 'pi pi-credit-card',
            path: '/app/settings/billing',
            submenu: [
              { label: 'Plans', path: '/app/settings/billing/plans' },
              { label: 'Payment Methods', path: '/app/settings/billing/payment' },
              { label: 'Invoices', path: '/app/settings/billing/invoices' }
            ]
          }
        ]
      },
      {
        title: 'Support',
        items: [
          {
            label: 'Help Center',
            icon: 'pi pi-question-circle',
            path: '/app/help'
          },
          {
            label: 'Documentation',
            icon: 'pi pi-file',
            path: '/app/help/docs'
          },
          {
            label: 'Contact Support',
            icon: 'pi pi-envelope',
            path: '/app/help/support'
          }
        ]
      }
    ]
  }
}