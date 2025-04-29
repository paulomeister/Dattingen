"use client"

import { FC } from "react"
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface FormInputFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: FieldPath<T>
  label: string
  placeholder: string
  description?: string
  type?: string
  className?: string
}

export function FormInputField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  description,
  type = "text",
  className = "border-primary-color/30 focus-visible:ring-secondary-color",
}: FormInputFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-primary-color">{label}</FormLabel>
          <FormControl>
            <Input 
              type={type} 
              placeholder={placeholder} 
              {...field} 
              className={className}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface FormSelectFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: FieldPath<T>
  label: string
  description?: string
  options: { value: string; label: string }[]
  className?: string
}

export function FormSelectField<T extends FieldValues>({
  form,
  name,
  label,
  description,
  options,
  className = "flex h-10 w-full rounded-md border border-primary-color/30 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-color focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
}: FormSelectFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-primary-color">{label}</FormLabel>
          <FormControl>
            <select {...field} className={className}>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}