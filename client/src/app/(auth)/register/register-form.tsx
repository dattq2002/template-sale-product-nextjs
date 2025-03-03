'use client'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RegisterBody, RegisterBodyType } from '@/schemaValidations/auth.schema'
import envConfig from '@/config'
import { useToast } from '@/components/ui/use-toast'

const RegisterForm = () => {
  const { toast } = useToast()
  // 1. Define your form.
  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: ''
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: RegisterBodyType) {
    try {
      const result = await fetch(`${envConfig.NEXT_PUBLIC_API_URL}/auth/register`, {
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
          form.setError(error.field as 'email' | 'password' | 'name' | 'confirmPassword', {
            type: 'server',
            message: error.message
          })
        })
      } else {
        toast({
          title: 'Đăng ký thất bại',
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
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input type='text' placeholder='Nhập họ tên bạn' {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' placeholder='Nhập email của bạn để đăng ký' {...field} formNoValidate />
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
                  <Input type='password' placeholder='Nhập password của bạn để đăng ký' {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhập lại mật khẩu</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='Nhập confirm password của bạn xác thực' {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='!mt-8 w-full' type='submit'>
            Đăng ký
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default RegisterForm
