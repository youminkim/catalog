import { Box, Button, Divider, Flex, FormControl, FormHelperText, FormLabel, Heading, Input, Link, Menu, MenuButton, MenuItem, MenuList, Stack, Text, Textarea } from '@chakra-ui/core'
import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import { useRouter } from 'next/router'
import { ChevronDownIcon } from '@chakra-ui/icons';
import {default as NextLink} from 'next/link'


export default function Home(props) {
  const [generatedUrl, setGeneratedUrl] = useState('')

  const baseUrl = 'https://catalog-five.vercel.app'

  const router = useRouter()
  const params = router.query

  return (
    <Box>
      <Heading mb="5">FB/IG Catalog Helper</Heading>
      <Flex my="5">
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton isActive={isOpen} as={Button} rightIcon={<ChevronDownIcon />}>
                Try Examples
              </MenuButton>
              <MenuList>
                <MenuItem><NextLink href="/?url=https%3A%2F%2Fcatalog-five.vercel.app%2Ftest.csv&country=AU&currency=AUD" passHref><a>Localized catalog (USD to AUD)</a></NextLink></MenuItem>
                <MenuItem><NextLink href="/?url=https%3A%2F%2Fcatalog-five.vercel.app%2Ftest.csv&inventory=999&category=Electronics" passHref><a>Checkout-available catalog (override inventory and category)</a></NextLink></MenuItem>
              </MenuList>
            </>
          )}
        </Menu>
      </Flex>
      <Formik
        enableReinitialize={true}
        initialValues={{url: params.url || '', country: params.country || '', currency: params.currency || '', inventory: params.inventory || '', category: params.category || ''}}
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
        {({ values, isSubmitting }) => (
          <Form>
            <Stack spacing={3}>
              <Field name="url">
                {({ field, form }) => (
                  <FormControl id="form_url" isInvalid={form.errors.name && form.touched.name} isRequired>
                  <FormLabel>Original Feed</FormLabel>
                  <Input {...field} id="url" placeholder="CSV file url" size="md" value={values.url} />
                  </FormControl>
                )}
              </Field>
              
              <Field name="country">
                {({ field, form }) => (
                  <FormControl id="form_country">
                    <FormLabel>Country Override</FormLabel>
                    <Input {...field} id="country" placeholder="e.g. US" size="md" value={values.country} />
                    <FormHelperText><Link href="https://www.facebook.com/business/help/2144286692311411?id=725943027795860">Use ISO Code</Link></FormHelperText>
                  </FormControl>
                )}
              </Field>
              
              <Field name="currency">
                {({ field, form }) => (
                  <FormControl id="form_currency">
                    <FormLabel>Currency Override</FormLabel>
                    <Input {...field} id="currency" placeholder="e.g. USD" size="md" value={values.currency} />
                    <FormHelperText><Link href="https://www.currency-iso.org/en/home/tables.html">Use ISO Code</Link></FormHelperText>
                  </FormControl>
                )}
              </Field>
                
              <Field name="inventory">
                {({ field, form }) => (
                  <FormControl id="form_inventory">
                    <FormLabel>Inventory # Override</FormLabel>
                    <Input {...field} id="inventory" placeholder="e.g. 999" size="md" value={values.inventory} />
                  </FormControl>
                )}
              </Field>
              

              <Field name="category">
                {({ field, form }) => (
                  <FormControl id="form_category">
                    <FormLabel>Category Override</FormLabel>
                    <Input {...field} id="category" placeholder="e.g. clothing & accessories" size="md" value={values.category} />
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
