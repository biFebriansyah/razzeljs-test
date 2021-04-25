import React from "react"
import { Helmet } from "react-helmet"
import PropTypes from "prop-types"
import { useLocation } from "react-router-dom"

function HelmetShare({ title, quote, description, image, hashtag, currentUrl }) {
    const location = useLocation()
    const currentLink = `https://dev.musicfly.id${location.pathname}`
    const qut = "Musicfly listen and share"
    const desc = "Musicfly webiste streaming music indoneisa gratis hanya untuk anda."

    return (
        <Helmet>
            <title>{title || "Musicfly"}</title>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="csrf_token" content="" />
            <meta property="type" content="website" />
            <meta property="url" content={currentLink} />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta name="msapplication-TileColor" content="#ffffff" />
            <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
            <meta name="theme-color" content="#ffffff" />
            <meta name="_token" content="" />
            <meta name="robots" content="noodp" />
            <meta property="title" content={title} />
            <meta property="quote" content={quote || qut} />
            <meta name="description" content={description || desc} />
            <meta property="image" content={image} />
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title || "Musicfly"} />
            <meta property="og:quote" content={quote || qut} />
            <meta property="og:hashtag" content={hashtag || "#Musicfly"} />
            <meta property="og:image" content={image} />
            <meta content="image/*" property="og:image:type" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:site_name" content="CampersTribe" />
            <meta property="og:description" content={description || desc} />
        </Helmet>
    )
}

HelmetShare.prototype = {
    title: PropTypes.string.isRequired,
    quote: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    hashtag: PropTypes.string,
    currentUrl: PropTypes.string,
}

export default HelmetShare
