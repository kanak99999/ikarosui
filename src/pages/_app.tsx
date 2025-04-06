import MyLayout from "@/components/MyLayout"
import { AppProps } from 'next/app'

function MyApp ({ Component, pageProps }: AppProps) {
  return (
    <MyLayout>
        <Component {...pageProps} />
    </MyLayout>
  )
}

export default MyApp