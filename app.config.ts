export default defineAppConfig({
  ui: {
    primary: 'blue',
    gray: 'neutral',
    card: {
      background: 'bg-gradient-to-br from-gray-900 to-gray-800',
      ring: 'ring-1 ring-gray-700',
      divide: 'divide-gray-700',
      shadow: 'shadow-xl',
      class: 'dark:border-gray-700'
    },
    form: {
      group: {
        container: 'space-y-2',
        label: {
          wrapper: 'flex items-center justify-between',
          base: 'block font-medium text-gray-200'
        },
        help: 'text-gray-400',
        error: 'text-red-500 dark:text-red-400',
        required: 'text-red-500 dark:text-red-400'
      },
      input: {
        base: 'block w-full rounded-md',
        color: {
          gray: {
            outline: 'bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500 focus:ring-blue-500'
          }
        }
      },
      select: {
        base: 'block w-full rounded-md',
        color: {
          gray: {
            outline: 'bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500 focus:ring-blue-500'
          }
        }
      },
      checkbox: {
        wrapper: 'relative flex items-start',
        base: 'h-5 w-5 rounded',
        background: 'bg-gray-800',
        color: {
          blue: {
            outline: 'border-gray-700 hover:border-blue-500 focus:border-blue-500 focus:ring-blue-500'
          }
        },
        label: 'font-medium text-gray-200 ms-2'
      }
    },
    button: {
      base: 'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 focus:ring-blue-500',
      color: {
        blue: {
          solid: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
          outline: 'border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white'
        },
        gray: {
          solid: 'bg-gray-700 hover:bg-gray-600 text-white shadow-sm',
          outline: 'border border-gray-600 text-gray-300 hover:bg-gray-700'
        }
      },
      variant: {
        solid: 'shadow-sm',
        outline: 'border'
      }
    },
  }
}) 