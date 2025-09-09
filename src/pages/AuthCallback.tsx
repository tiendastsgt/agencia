import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setStatus('error')
          setMessage('Error al procesar la autenticación: ' + error.message)
          return
        }

        if (data.session) {
          setStatus('success')
          setMessage('Autenticación exitosa. Redirigiendo...')
          setTimeout(() => {
            navigate('/dashboard')
          }, 2000)
        } else {
          setStatus('error')
          setMessage('No se pudo completar la autenticación')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Error inesperado: ' + (error as Error).message)
      }
    }

    handleAuthCallback()
  }, [navigate])

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-600" />
      case 'error':
        return <XCircle className="h-8 w-8 text-red-600" />
    }
  }

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Procesando...'
      case 'success':
        return '¡Éxito!'
      case 'error':
        return 'Error'
    }
  }

  const getDescription = () => {
    switch (status) {
      case 'loading':
        return 'Verificando tu autenticación...'
      case 'success':
        return message
      case 'error':
        return message
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getIcon()}
            </div>
            <CardTitle>{getTitle()}</CardTitle>
            <CardDescription>{getDescription()}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {status === 'error' && (
              <div className="space-y-4">
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Volver al Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

