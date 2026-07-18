"import { BrowserRouter, Routes, Route, Navigate } from \"react-router-dom\";
import { Layout } from \"@/components/layout/Layout\";
import { Home } from \"@/pages/Home\";
import { Calculator } from \"@/pages/Calculator\";
import { Brokers } from \"@/pages/Brokers\";
import { BrokerProfile } from \"@/pages/BrokerProfile\";
import { BrokerMtf } from \"@/pages/BrokerMtf\";
import { Compare } from \"@/pages/Compare\";
import { Ledger } from \"@/pages/Ledger\";
import { TariffsCurrent } from \"@/pages/TariffsCurrent\";
import { TariffsHistory } from \"@/pages/TariffsHistory\";
import { Methodology } from \"@/pages/Methodology\";
import { DataSources } from \"@/pages/DataSources\";
import { Guides } from \"@/pages/Guides\";
import { About } from \"@/pages/About\";
import { Disclaimer } from \"@/pages/Disclaimer\";
import { Toaster } from \"@/components/ui/sonner\";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path=\"/\" element={<Home />} />
          <Route path=\"/calculator\" element={<Calculator />} />
          <Route path=\"/brokers\" element={<Brokers />} />
          <Route path=\"/brokers/:brokerSlug\" element={<BrokerProfile />} />
          <Route path=\"/brokers/:brokerSlug/mtf\" element={<BrokerMtf />} />
          <Route path=\"/compare\" element={<Compare />} />
          <Route path=\"/ledger\" element={<Ledger />} />
          <Route path=\"/tariffs\" element={<Navigate to=\"/tariffs/current\" replace />} />
          <Route path=\"/tariffs/current\" element={<TariffsCurrent />} />
          <Route path=\"/tariffs/history\" element={<TariffsHistory />} />
          <Route path=\"/methodology\" element={<Methodology />} />
          <Route path=\"/data-sources\" element={<DataSources />} />
          <Route path=\"/guides\" element={<Guides />} />
          <Route path=\"/about\" element={<About />} />
          <Route path=\"/disclaimer\" element={<Disclaimer />} />
          <Route path=\"*\" element={<Navigate to=\"/\" replace />} />
        </Routes>
      </Layout>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
"