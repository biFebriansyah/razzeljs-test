import React from "react"
import { Helmet } from "react-helmet"
import PropTypes from "prop-types"

function HelmetMeta({ title, desc, img, imgalt }) {
    return (
        <Helmet>
            <title>{title}</title>
            <meta property="og:title" content={title} />
            <meta name="description" content={desc} />
            <meta property="og:description" content={desc} />
            <meta property="og:image" content={img} />
            <meta property="url" content={`https://www.musicfly.id/`} />
            <meta property="og:url" content={`https://dev.musicfly.id/`} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image:alt" content={imgalt} />
        </Helmet>
    )
}

HelmetMeta.propTypes = {
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    imgalt: PropTypes.string.isRequired,
}

export default HelmetMeta
