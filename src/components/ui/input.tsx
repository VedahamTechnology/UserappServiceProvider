import { View, Text } from 'react-native'
import React from 'react'
import { Input } from '../../../@/components/ui/input'

export default function input() {
  return (
     <Input
      keyboardType="email-address"
      textContentType="emailAddress"
      autoComplete="email"
      placeholder="Email"
    />
  )
}