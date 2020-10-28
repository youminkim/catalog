import { Box, Button, Divider, FormControl, FormHelperText, FormLabel, Heading, Input, Link, Stack, Text, Textarea } from '@chakra-ui/core'
import { Field, Form, Formik } from 'formik';
import { useState } from 'react';

export default function Home() {
  const [generatedUrl, setGeneratedUrl] = useState('')
  const baseUrl = "https://catalog.vercel.app"

  return (
    <Box>
      <Heading mb="5">FB/IG Catalog Helper</Heading>
      <Formik
        initialValues={{url: '', country: '', currency: '', inventory: '', category: ''}}
        validate={values => {
          const errors = {};
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {

          function q(values) {
            return Object.keys(values)
              .map((c)=>{return {
                value:values[c],
                key: c,
              }})
              .filter((c)=>c.value)
              .map((c)=>`${c.key}=${encodeURIComponent(c.value)}`)
              .join("&")
          }
          console.log(q(values))

          setGeneratedUrl(`${baseUrl}/feed?${q(values)}`)
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack spacing={3}>
              <Field name="url">
                {({ field, form }) => (
                  <FormControl id="form_url" isInvalid={form.errors.name && form.touched.name} isRequired>
                  <FormLabel>Original Feed</FormLabel>
                  <Input {...field} id="url" placeholder="CSV file url" size="md" />
                  </FormControl>
                )}
              </Field>
              
              <Field name="country">
                {({ field, form }) => (
                  <FormControl id="form_country">
                    <FormLabel>Country Override</FormLabel>
                    <Input {...field} id="country" placeholder="e.g. US" size="md" />
                    <FormHelperText><Link href="https://www.facebook.com/business/help/2144286692311411?id=725943027795860">Use ISO Code</Link></FormHelperText>
                  </FormControl>
                )}
              </Field>
              
              <Field name="currency">
                {({ field, form }) => (
                  <FormControl id="form_currency">
                    <FormLabel>Currency Override</FormLabel>
                    <Input {...field} id="currency" placeholder="e.g. USD" size="md" />
                    <FormHelperText><Link href="https://www.currency-iso.org/en/home/tables.html">Use ISO Code</Link></FormHelperText>
                  </FormControl>
                )}
              </Field>
                
              <Field name="inventory">
                {({ field, form }) => (
                  <FormControl id="form_inventory">
                    <FormLabel>Inventory # Override</FormLabel>
                    <Input {...field} id="inventory" placeholder="e.g. 999" size="md" />
                  </FormControl>
                )}
              </Field>
              

              <Field name="category">
                {({ field, form }) => (
                  <FormControl id="form_category">
                    <FormLabel>Category Override</FormLabel>
                    <Input {...field} id="category" placeholder="e.g. clothing & accessories" size="md" />
                    <FormHelperText><Link href="https://www.facebook.com/help/526764014610932">Use Facebook or Google product category</Link></FormHelperText>
                  </FormControl>
                )}
              </Field>

              <Button type="submit" disabled={isSubmitting}>
                Generate New Feed
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
      {generatedUrl ? 
        (
          <>
            <Divider my="5" />
            <Text><Link href={generatedUrl}>{generatedUrl}</Link></Text>
          </>
        )
      : null}
    </Box>
  )
}
