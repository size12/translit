import React from 'react';
import { default as CountryFlag2 } from 'react-native-country-flag';

interface CountryFlagProps {
  isoCode: string;
  size: number;
  style?: any;
}

export default function CountryFlag({
  isoCode,
  size,
  style,
}: CountryFlagProps) {
  if (!isoCode || isoCode === 'unknown') {
    // return <Image source={require('../../assets/images/unknown-flag.png')} style={{width: size * 1.6, height: size}} />
    return null;
  }

  return <CountryFlag2 isoCode={isoCode} size={size} style={style} />;
}
