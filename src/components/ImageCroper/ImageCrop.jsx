import "./scss/style.scoped.scss"
import React, { useState, useCallback } from "react"
import { Link } from "react-router-dom"
import Cropper from "react-easy-crop"
import Slider from "rc-slider"
import getCroppedImg from "helpers/cropImage"

function ImageCrop(props) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const saveCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(props.image, croppedAreaPixels)
            props.save(croppedImage)
        } catch (e) {
            console.error(e)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [croppedAreaPixels])

    return (
        <div className="modal-crop">
            <div
                className="btn-close"
                onClick={() => {
                    props.close()
                }}
            >
                <i className="icon-close" />
            </div>
            <div className="cropCon">
                <Cropper
                    image={props.image}
                    crop={crop}
                    zoom={zoom}
                    aspect={props.ratio}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>
            <div className="cropControl">
                <div className="zoom">
                    <h4>ZOOM Image</h4>
                    <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(val) => {
                            setZoom(val)
                        }}
                    />
                </div>
                <div className="btn-save">
                    <Link className={`btn btn-success`} to="#" onClick={saveCroppedImage}>
                        <span className="text">Save</span>
                        <i
                            className="fa fa-spin fa-spinner text-active"
                            style={{ marginRight: "10px" }}
                        />
                        <span className="text-active">Wait..</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ImageCrop
