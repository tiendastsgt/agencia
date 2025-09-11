import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'
import { useAuth } from '@/lib/authSimple'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/sonner'

const experimentSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  description: z.string().optional(),
  experiment_type: z.enum(['content', 'campaign', 'strategy']),
  target_metric: z.enum(['ctr', 'conversion', 'engagement']),
  algorithm_type: z.enum(['epsilon-greedy', 'ucb', 'thompson', 'contextual']),
  algorithm_options: z.object({
    epsilon: z.number().min(0).max(1).optional(),
    confidence_level: z.number().min(0).optional(),
    prior_alpha: z.number().min(0).optional(),
    prior_beta: z.number().min(0).optional(),
    num_features: z.number().min(1).optional()
  }).optional(),
  arms: z.array(z.object({
    arm_id: z.string(),
    name: z.string(),
    configuration: z.any()
  })).min(2, 'Mínimo 2 brazos requeridos')
})

type ExperimentFormData = z.infer<typeof experimentSchema>

interface CreateExperimentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
}

export function CreateExperimentDialog({ open, onOpenChange, clientId }: CreateExperimentDialogProps) {
  const queryClient = useQueryClient()
  const { session, user } = useAuth()
  const form = useForm<ExperimentFormData>({
    resolver: zodResolver(experimentSchema),
    defaultValues: {
      name: '',
      description: '',
      experiment_type: 'content',
      target_metric: 'ctr',
      algorithm_type: 'epsilon-greedy',
      algorithm_options: {
        epsilon: 0.1,
        confidence_level: 2.0,
        prior_alpha: 1,
        prior_beta: 1,
        num_features: 4
      },
      arms: [
        { arm_id: 'variant_a', name: 'Variante A', configuration: {} },
        { arm_id: 'variant_b', name: 'Variante B', configuration: {} }
      ]
    }
  })

  const createExperimentMutation = useMutation({
    mutationFn: async (data: ExperimentFormData) => {
      if (!user || !session?.access_token) {
        throw new Error('Usuario no autenticado')
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mab-experiment-manager`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          client_id: clientId,
          created_by: user.id
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Error al crear experimento')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mab-experiments'] })
      onOpenChange(false)
      form.reset()
      toast.success('Experimento creado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al crear experimento: ' + error.message)
    }
  })

  const addArm = () => {
    const currentArms = form.getValues('arms')
    const newArmId = `variant_${String.fromCharCode(97 + currentArms.length)}`
    form.setValue('arms', [...currentArms, {
      arm_id: newArmId,
      name: `Variante ${String.fromCharCode(65 + currentArms.length)}`,
      configuration: {}
    }])
  }

  const removeArm = (index: number) => {
    const currentArms = form.getValues('arms')
    if (currentArms.length > 2) {
      form.setValue('arms', currentArms.filter((_, i) => i !== index))
    }
  }

  const onSubmit = (data: ExperimentFormData) => {
    createExperimentMutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Experimento A/B</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Experimento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Test de headlines homepage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe el objetivo del experimento..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="experiment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Experimento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="content">Contenido</SelectItem>
                        <SelectItem value="campaign">Campaña</SelectItem>
                        <SelectItem value="strategy">Estrategia</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="target_metric"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Métrica Objetivo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar métrica" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ctr">CTR (Click Through Rate)</SelectItem>
                        <SelectItem value="conversion">Conversión</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="algorithm_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Algoritmo MAB</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar algoritmo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="epsilon-greedy">Epsilon-Greedy (Simple)</SelectItem>
                      <SelectItem value="ucb">Upper Confidence Bound (UCB)</SelectItem>
                      <SelectItem value="thompson">Thompson Sampling (Bayesiano)</SelectItem>
                      <SelectItem value="contextual">Contextual Bandit (Personalizado)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Algorithm-specific options */}
            {form.watch('algorithm_type') === 'epsilon-greedy' && (
              <FormField
                control={form.control}
                name="algorithm_options.epsilon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tasa de Exploración (Epsilon)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        max="1" 
                        placeholder="0.1"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch('algorithm_type') === 'ucb' && (
              <FormField
                control={form.control}
                name="algorithm_options.confidence_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel de Confianza (Alpha)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        min="0" 
                        placeholder="2.0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch('algorithm_type') === 'thompson' && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="algorithm_options.prior_alpha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prior Alpha</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          min="0" 
                          placeholder="1"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="algorithm_options.prior_beta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prior Beta</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          min="0" 
                          placeholder="1"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {form.watch('algorithm_type') === 'contextual' && (
              <FormField
                control={form.control}
                name="algorithm_options.num_features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Características</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="4"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Brazos del Experimento</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={addArm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Brazo
                </Button>
              </div>

              {form.watch('arms').map((arm, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Brazo {index + 1}</Badge>
                    {form.watch('arms').length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArm(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`arms.${index}.arm_id`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID del Brazo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`arms.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createExperimentMutation.isPending}>
                {createExperimentMutation.isPending ? 'Creando...' : 'Crear Experimento'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}