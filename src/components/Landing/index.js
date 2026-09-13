import React, { useRef } from 'react';

import ProductHero from './ProductHero';
import ProductValues from './ProductValues';
import ProductDownload from './ProductDownload';
import ProductSmokingHero from './ProductSmokingHero';

const LandingPage = () => {
  const myRef = useRef(null);
  const executeScroll = () => myRef.current.scrollIntoView({behavior: "smooth"});
  return(
    <React.Fragment>
      <ProductHero onDownloadClick={executeScroll} />
      <ProductValues />
      <div ref={myRef}></div> 
      <ProductDownload />
      <ProductSmokingHero />
    </React.Fragment>
  )
}
export default LandingPage;
