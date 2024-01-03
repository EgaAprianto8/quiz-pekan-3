import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Head from "next/head";

export default function Layout({ children, metaTitle, metaDescription }) {
  return (
    <>
      <Head>
        <title>Quiz Pekan 3 - {metaTitle} </title>
        <meta name="description" content={metaDescription || "Quiz Pekan 3"}/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {children}
      <Footer />
    </>
  );
}
