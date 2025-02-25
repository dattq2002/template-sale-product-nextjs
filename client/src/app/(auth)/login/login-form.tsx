'use client'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import envConfig from '@/config'
import { useToast } from '@/components/ui/use-toast'

const LoginForm = () => {
  const { toast } = useToast()
  // 1. Define your form.
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: LoginBodyType) {
    try {
      const result = await fetch(`${envConfig.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      }).then(async (res) => {
        const payload = await res.json()
        const data = {
          status: res.status,
          payload
        }
        if (!res.ok) {
          throw data
        }
        return data
      })
      console.log(result)
      toast({
        title: result.payload.message + ' ✓',
        duration: 3000
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errors = error.payload.errors as { field: string; message: string }[]
      const status = error.status as number
      if (status === 422) {
        errors.forEach((error) => {
          form.setError(error.field as 'email' | 'password', { type: 'server', message: error.message })
        })
      } else {
        toast({
          title: 'Đăng nhập thất bại',
          description: error.payload.message,
          variant: 'destructive'
        })
      }
    }
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 flex-shrink-0 w-72 '>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' placeholder='Nhập email của bạn để đăng nhập' {...field} formNoValidate />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='Nhập password của bạn để đăng nhập' {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='!mt-8 w-full' type='submit'>
            Đăng Nhập
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default LoginForm
