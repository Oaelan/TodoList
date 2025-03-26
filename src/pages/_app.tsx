import { AppProps } from "next/app";
import "../../styles/globals.css"; // src/pages에서 두 단계 위로 (루트의 styles/)
import Header from "@/components/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App flex flex-col">
        <Header />
        <Component {...pageProps} />
      </div>
    </QueryClientProvider>
  );
}
