import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { wrapper } from 'store';
import Layout from '../src/components/Layout';
import '../styles/globals.css';

const App = ({ Component, ...rest }: AppProps) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <Layout>
        <Component {...props.pageProps} />
      </Layout>
    </Provider>
  );
};
export default App;
