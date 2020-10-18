import React, { useState, useEffect } from "react";
import ReactGlobe from "react-globe";
import slugify from 'slugify'

// Styling for country name text on hover
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

import defaultMarkers from "./markers";

let selectedMarker = null;
let selectedCountry = null;

const options = {
    initialCameraDistanceRadiusScale: 15,
    cameraAutoRotateSpeed: 0.2,
    cameraZoomSpeed: 1,
    globeGlowRadiusScale: 0,
    globeGlowCoefficient: 0,
    globeGlowPower: 0,
    enableGlobeGlow: false,
    enableMarkerGlow: false,
    enableMarkerTooltip: true,
    focusAnimationDuration: 1000,
    markerEnterAnimationDuration: 3000,
    markerEnterEasingFunction: ['Bounce', 'InOut'],
    markerExitAnimationDuration: 3000,
    markerExitEasingFunction: ['Cubic', 'Out'],
    markerRadiusScaleRange: [0.01, 0.01],
    markerTooltipRenderer: marker =>
        `${marker.country}`,
};

const Globe = (props) => {
    const allMarkers = defaultMarkers.map((marker) => ({
        ...marker,
        value: Math.floor(Math.random() * 100)
    }));
    const [event, setEvent] = useState(null);
    const [details, setDetails] = useState(null);

    const [globe, setGlobe] = useState()
    const [focus, setFocus] = useState(null)

    function onClickMarker(marker, markerObject, event) {

        selectedCountry = marker.country

        // Update for info in the Data component
        props.updateCountry({
            country: slugify(marker.country, {lower: true, strict: true}),
            coords: marker.coordinates
        })

        selectedMarker = markerObject
        markerObject.material.color.setHex("0xb80c09")

        stopGlobeRotation()
    }
    
    // When going back to world overview
    function onDefocus(previousFocus) {
        setEvent({
          type: "DEFOCUS",
          previousFocus
        });
        setDetails(null);

        // Enable earth rotation again
        setTimeout(function() {
            globe.updateOptions(
                {...options,cameraAutoRotateSpeed: 0.2}
            )
        }, 1000)

        selectedCountry = null
        selectedMarker.material.color.setHex("0xffffff") // Reset color of active marker

        // Update the info for the Data component
        props.updateCountry({
            country: null,
            coords: null
        })
    }

    function onMouseOutMarker(previousMarker, markerObject, event) {
        setEvent({
          type: 'MOUSEOUT',
          previousMarker,
          previousMarkerObjectID: markerObject.uuid,
          pointerEventPosition: { x: event.clientX, y: event.clientY },
        })

        // Don't reset color if the marker has been selected
        if(slugify(previousMarker.country, {lower: true, strict: true}) !== selectedCountry){
            markerObject.material.color.setHex("0xffffff")
        }
    }
    
    function onMouseOverMarker(marker, markerObject, event) {
        setEvent({
          type: 'MOUSEOVER',
          marker,
          markerObjectID: markerObject.uuid,
          pointerEventPosition: { x: event.clientX, y: event.clientY },
        })
        
        markerObject.material.color.setHex("0xb80c09")
    }

    // Stop the earth from rotating when focussed on a country
    function stopGlobeRotation(){
        setTimeout(function() {
            globe.updateOptions(
                {...options,cameraAutoRotateSpeed: 0}
            )
        }, 1000)
    }

    useEffect(() => {

        // Focus on country if select dropdown from Data component was used
        if(props.selectedCountry.country !== null && props.updateCountry) {
            globe.updateFocus(
                [props.selectedCountry.coords[0], props.selectedCountry.coords[1]]
            )
            
            selectedCountry = props.selectedCountry.country

            stopGlobeRotation()
        }
    }, [props])

    return(
        <ReactGlobe
            globeTexture="./assets/earth/8081_earthbump10k-bw.png"
            globeBackgroundTexture={null}
            height="100vh"
            width="100vw"
            markers={allMarkers}
            focus={focus}
            options={options}
            onClickMarker={onClickMarker}
            onDefocus={onDefocus}
            onMouseOutMarker={onMouseOutMarker}
            onMouseOverMarker={onMouseOverMarker}
            onGetGlobe={setGlobe}
        />
    )
}

export default Globe
