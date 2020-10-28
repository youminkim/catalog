import { Box, ChakraProvider } from '@chakra-ui/core'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <title>Facebook/Instagram Catalog Helper</title>
    </Head>
    <ChakraProvider>
      <Box m="5">
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  </>
}

export default MyApp
