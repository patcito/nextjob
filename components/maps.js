import React from 'react';

export default class Maps extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyCtGDNEssxr52H2jtrcSXlWrkN18oTP5Ec&libraries=places';
    script.async = true;
    const c = this.props;
    script.onload = () => {
      c.setGoogleMaps();
    };
    document.body.appendChild(script);
  }
  render() {
    return null;
  }
}
