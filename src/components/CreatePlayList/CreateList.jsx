import React, { useState, useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "helpers/api"
import { useDropzone } from "react-dropzone"
import { connect } from "react-redux"
import { OptionsContext } from "helpers/contex"
import ImageCroper from "components/ImageCroper/ImageCrop"
import { useToasts } from "react-toast-notifications"
import "./scss/style.scoped.scss"

function CreateList(props) {
    const isOpen = props.open ? "show" : "hide"
    let defaultImage =
        "https://res.cloudinary.com/devops2/image/upload/v1612864760/musicfly/m40_x31sif.jpg"
    const [ListName, setListName] = useState("Masuk Nama")
    const [onLoading, setOnLoading] = useState(false)
    const [codeList, SetCodeList] = useState("")
    const [imageList, setImageList] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [cropOpen, setCropOpen] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [LisData, setListData] = useState({})
    const [croppedImage, setCroppedImage] = useState(null)
    const { changeList } = useContext(OptionsContext)
    const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
        accept: "image/jpeg, image/png",
        noKeyboard: true,
        noClick: true,
    })
    const { addToast } = useToasts()

    useEffect(() => {
        if (props.id !== null) {
            const apis = new api(props.tokens)
            const { username_personal } = props.users.data
            apis.req({
                method: "GET",
                url: `/playlist?order[id_playlist]=ASC&per_page=2&page=1&active=1&user_playlist=${username_personal}&id_playlist=${
                    props.id
                }`,
            })
                .then((res) => {
                    const { data } = res.data
                    const newData = {
                        ...data[0],
                        foto_path_playlist: data[0].foto_path_playlist
                            ? data[0].foto_path_playlist
                            : defaultImage,
                    }
                    setListName(newData.complete_name_playlist)
                    setListData(newData)
                    SetCodeList(newData.object_code_playlist)
                    setIsUpdate(true)
                })
                .catch((er) => {
                    console.log(er)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.id])

    useEffect(() => {
        if (acceptedFiles.length > 0) {
            acceptedFiles.map((data) => {
                const reader = new FileReader()
                reader.onload = () => {
                    const file = reader.result
                    setImageList(file)
                }
                reader.readAsDataURL(data)
                return true
            })
            setCropOpen(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acceptedFiles])

    const toggle = () => {
        setImageList(defaultImage)
        setIsUpdate(false)
        setCropOpen(false)
        setListName("Masukan Nama")
        setCroppedImage(null)
        setImageFile(null)
        props.toggleModal()
    }

    const SaveImage = (data) => {
        setCroppedImage(data.image)
        setImageFile(data.file)
        setCropOpen(false)
    }

    const inputChange = (el) => {
        setListName(el.target.value)
    }

    const getListLength = () => {
        return new Promise((resolve, reject) => {
            const apis = new api(props.tokens)
            const { username_personal } = props.users.data
            apis.req({
                method: "GET",
                url: `/playlist?order[id_playlist]=ASC&per_page=999&page=1&active=1&user_playlist=${username_personal}`,
            })
                .then((res) => {
                    const { data } = res.data
                    resolve(data.length)
                })
                .catch((er) => {
                    reject(er)
                })
        })
    }

    const saveList = async () => {
        setOnLoading(true)
        const apis = new api(props.tokens)
        const bodyFormData = new FormData()
        bodyFormData.append("complete_name", ListName)
        if (imageFile) {
            bodyFormData.append("file", imageFile)
        } else {
            bodyFormData.append("file", defaultImage)
        }
        apis.FormData({
            method: "POST",
            url: `/playlist`,
            data: bodyFormData,
        })
            .then(async () => {
                const newLength = await getListLength()
                setOnLoading(false)
                addToast(`${ListName} Berhasil dibuat`, { appearance: "success" })
                changeList(newLength)
                toggle()
            })
            .catch((er) => {
                setOnLoading(false)
                addToast(`${ListName} gagal dibuat`, { appearance: "error" })
            })
    }

    const UpdateListPic = () => {
        return new Promise((resolve, reject) => {
            const apis = new api(props.tokens)
            const bodyFormData = new FormData()
            bodyFormData.append("file", imageFile)
            bodyFormData.append("playlist_code", codeList)
            apis.FormData({
                method: "POST",
                url: `/playlist/upload/foto`,
                data: bodyFormData,
            })
                .then((res) => {
                    const { data } = res.data
                    resolve(data)
                })
                .catch((er) => {
                    reject(er)
                })
        })
    }

    const UpdateList = async () => {
        setOnLoading(true)
        const apis = new api(props.tokens)
        apis.req({
            method: "PUT",
            url: "/playlist",
            data: {
                id: props.id,
                complete_name: ListName,
                description: "List Favorite Playlist",
            },
        })
            .then(async () => {
                if (imageFile) {
                    await UpdateListPic()
                }
                setOnLoading(false)
                changeList(Math.floor(Math.random() * 20) + 1)
                addToast(`${ListName} Berhasil dupdate`, { appearance: "success" })
                toggle()
            })
            .catch((er) => {
                setOnLoading(false)
                addToast(`${ListName} gagal dupdate`, { appearance: "error" })
            })
    }

    const onLoadStyle = {
        width: "100%",
        height: "100vh",
        display: onLoading ? "flex" : "none",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "40px",
        backdropFilter: "blur(1px)",
        color: "white",
        zIndex: 9999,
    }

    return (
        <div className={`container ${isOpen}`}>
            <div style={onLoadStyle}>
                <i className="fa fa-spin fa-spinner text" style={{ marginRight: "10px" }} />
                <span className="text">Wait..</span>
            </div>
            {cropOpen ? (
                <ImageCroper
                    image={imageList}
                    save={SaveImage}
                    ratio={16 / 9}
                    close={() => setCropOpen(false)}
                />
            ) : (
                <div className="modal-cos">
                    <div className="btn-close" onClick={toggle}>
                        <i className="icon-close" />
                    </div>
                    <div
                        {...getRootProps({ className: "dropzone" })}
                        className="m-t-n-xxs item pos-rlt"
                    >
                        <input {...getInputProps()} />
                        <div className="center text-center m-t-n choose-image">
                            <Link to="#" data-toggle="class" onClick={open}>
                                <i className="fa fa-file i-2x text text-image" />
                                <h3 className="text-image">Choose image</h3>
                            </Link>
                        </div>
                        <div className="bottom gd bg-info wrapper-lg container-btn">
                            <div className="inpform">
                                <input
                                    type="text"
                                    className="h2 font-thin"
                                    autoFocus={true}
                                    name="username"
                                    autoComplete="off"
                                    onChange={inputChange}
                                    value={ListName}
                                />
                            </div>
                            <Link
                                className={`btn btn-Black`}
                                to="#"
                                onClick={isUpdate ? UpdateList : saveList}
                            >
                                <span className="text">Save</span>
                                <i
                                    className="fa fa-spin fa-spinner text-active"
                                    style={{ marginRight: "10px" }}
                                />
                                <span className="text-active">Wait..</span>
                            </Link>
                        </div>
                        <div className="imageCover">
                            <img
                                className="img-full"
                                src={
                                    isUpdate && croppedImage === null
                                        ? LisData.foto_path_playlist
                                        : croppedImage !== null
                                        ? croppedImage
                                        : defaultImage
                                }
                                alt="..."
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        users: state.users,
        tokens: state.users.token,
    }
}

export default connect(mapStateToProps)(CreateList)
