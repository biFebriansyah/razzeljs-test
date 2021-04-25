import "./scss/style.scoped.scss"
import React, { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { useDropzone } from "react-dropzone"
import { useToasts } from "react-toast-notifications"
import { OptionsContext } from "helpers/contex"
import { selectProfile } from "helpers/selectStyle"
import HelmetMeta from "views/Helmet"
import Select from "react-select"
import MyDate from "./ReactDate"
import api from "helpers/api"
import loggs from "helpers/logs"
import moment from "moment"
import CropModal from "components/CropModal/CropModal"

function User(props) {
    const doRequest = new api(props.tokens).req
    const { UpdateUser } = useContext(OptionsContext)
    const { addToast } = useToasts()
    const logger = new loggs(true, "Profile")
    const [PersonData, SetPersonData] = useState({})
    const [AcountData, SetAcountData] = useState({})
    const [Prov, SetProv] = useState([])
    const [Kota, SetKota] = useState([])
    const [KotaShow, SetKotaShow] = useState(false)
    const [Kecamatan, SetKeamatan] = useState([])
    const [KecamatanShow, SetKeamatanShow] = useState(false)
    const [Kelurahan, SetKelurahan] = useState([])
    const [KelurahanShow, SetKelurahanShow] = useState(false)
    const [edited, setEdited] = useState(false)
    const [editPass, setEditPass] = useState(false)
    const [isError, SetIsError] = useState(false)
    const [imageChos, setImagechos] = useState(null)
    // const [cropedImage, setCropedImage] = useState(null)
    const [showCrop, setChowCrop] = useState(false)

    const avatar =
        "https://res.cloudinary.com/devops2/image/upload/v1610881331/musicfly/user_l3cqpi.png"

    const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
        accept: "image/jpeg, image/png",
        noKeyboard: true,
        noClick: true,
    })

    const GetProfleData = () => {
        doRequest({
            method: "GET",
            url: "auth?include=personal,label,role&page=1&per_page=5",
        })
            .then((res) => {
                const { personal, ...accont } = res.data.data[0]
                const {
                    provinsi_personal,
                    kota_personal,
                    kecamatan_personal,
                    kelurahan_personal,
                } = personal
                const person = {
                    ...personal,
                    id: personal.id_personal,
                    fullname: personal.complete_name_personal,
                    complete_name: personal.complete_name_personal,
                    foto_path_personal: personal.foto_path_personal || avatar,
                    tanggal_lahir_personal: moment(personal.tanggal_lahir_personal),
                    address: personal.address_personal,
                    country: "ID",
                    userprovinsi: provinsi_personal ? provinsi_personal.description_object : null,
                    userkota: kota_personal ? kota_personal.description_object : null,
                    userkecamatan: kecamatan_personal
                        ? kecamatan_personal.description_object
                        : null,
                    userkelurahan: kelurahan_personal
                        ? kelurahan_personal.description_object
                        : null,
                }
                const akun = {
                    ...accont,
                    id: accont.id_user,
                    email: accont.email_user,
                    telephone: accont.telephone_user,
                    passwordcek: "",
                    password: "",
                    passwordtes: "",
                }
                if (provinsi_personal) {
                    GetKota(provinsi_personal.code_object)
                }
                if (kota_personal) {
                    GetKecamatan(kota_personal.code_object)
                }
                if (kecamatan_personal) {
                    GetKelurahan(kecamatan_personal.code_object)
                }

                SetPersonData(person)
                SetAcountData(akun)
            })
            .catch((er) => {
                logger.Show(er)
            })
    }

    const GetProvinsi = () => {
        doRequest({
            method: "GET",
            url: "idn-region/prov?page=1&per_page=999",
        })
            .then((res) => {
                const { data } = res.data
                const type = []
                data.forEach((val) => {
                    type.push({ value: val.provinsi_id, label: val.provinsi_name })
                })
                SetProv(type)
            })
            .catch(() => {
                addToast("Ada Masalah Di Api Provinsi", { appearance: "error" })
            })
    }

    const GetKota = (idProv) => {
        doRequest({
            method: "GET",
            url: `idn-region/kota?page=1&per_page=999&provinsi_id=${idProv}`,
        })
            .then((res) => {
                const { data } = res.data
                const type = []
                data.forEach((val) => {
                    type.push({ value: val.kota_id, label: val.kota_name })
                })
                SetKota(type)
                SetKotaShow(true)
            })
            .catch(() => {
                addToast("Ada Masalah Di Api Provinsi", { appearance: "error" })
            })
    }

    const GetKecamatan = (idKota) => {
        doRequest({
            method: "GET",
            url: `idn-region/kec?page=1&per_page=999&kota_id=${idKota}`,
        })
            .then((res) => {
                const { data } = res.data
                const type = []
                data.forEach((val) => {
                    type.push({ value: val.kecamatan_id, label: val.kecamatan_name })
                })
                SetKeamatan(type)
                SetKeamatanShow(true)
            })
            .catch(() => {
                addToast("Ada Masalah Di Api Provinsi", { appearance: "error" })
            })
    }

    const GetKelurahan = (idKec) => {
        doRequest({
            method: "GET",
            url: `idn-region/kel?page=1&per_page=999&kecamatan_id=${idKec}`,
        })
            .then((res) => {
                const { data } = res.data
                const type = []
                data.forEach((val) => {
                    type.push({ value: val.kelurahan_id, label: val.keluarahan_name })
                })
                SetKelurahan(type)
                SetKelurahanShow(true)
            })
            .catch(() => {
                addToast("Ada Masalah Di Api Provinsi", { appearance: "error" })
            })
    }

    useEffect(() => {
        if (acceptedFiles.length > 0) {
            acceptedFiles.map((data) => {
                const reader = new FileReader()
                reader.onload = () => {
                    const file = reader.result
                    setImagechos(file)
                }
                reader.readAsDataURL(data)
                return true
            })
            setChowCrop(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acceptedFiles])

    // TODO mounted
    useEffect(() => {
        GetProfleData()
        GetProvinsi()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const ChangeInput = (el) => {
        const data = { ...PersonData }
        data[el.target.name] = el.target.value
        SetPersonData(data)
    }

    const ChangeAccountInput = (el) => {
        if (el.target.name === "password" || el.target.name === "passwordtes") {
            SetIsError(false)
        }
        const data = { ...AcountData }
        data[el.target.name] = el.target.value
        SetAcountData(data)
    }

    const setDateLahir = (val) => {
        const data = { ...PersonData }
        data["tanggal_lahir_personal"] = val
        SetPersonData(data)
    }

    const SaveImage = (rwa) => {
        const bodyFormData = new FormData()
        bodyFormData.append("file", rwa.file)
        bodyFormData.append("username", AcountData.username_user)

        doRequest({
            method: "POST",
            url: "personal/upload/foto",
            data: bodyFormData,
        })
            .then(() => {
                UpdateUser()
                const data = { ...PersonData }
                data["foto_path_personal"] = rwa.image
                SetPersonData(data)
                setChowCrop(false)
            })
            .catch(() => {
                setChowCrop(false)
                addToast("Update data gagal", { appearance: "error" })
            })
    }

    const updateAccount = () => {
        if (AcountData.password !== AcountData.passwordtes) {
            SetIsError(true)
            return
        }
        doRequest({
            method: "PUT",
            url: "users",
            data: AcountData,
        })
            .then(() => {
                UpdateUser()
                addToast("Update data berhasil", { appearance: "success" })
                setEdited(false)
                GetProfleData()
                // window.location.reload()
            })
            .catch((err) => {
                addToast("Update data gagal", { appearance: "error" })
                // window.location.reload()
            })
    }

    const updateData = () => {
        doRequest({
            method: "PUT",
            url: "personal",
            data: PersonData,
        })
            .then(() => {
                UpdateUser()
                addToast("Update data berhasil", { appearance: "success" })
                setEdited(false)
                GetProfleData()
                // window.location.reload()
            })
            .catch((err) => {
                addToast("Update data gagal", { appearance: "error" })
                // window.location.reload()
            })
    }

    return (
        <div className="users">
            <HelmetMeta
                title="Musicfly - Profile"
                desc="Your can change or fill your data here"
                img="https://res.cloudinary.com/devops2/image/upload/v1618237589/musicfly/logo_ekro0x.png"
                imgalt="muscifly-logo"
            />
            <CropModal
                open={showCrop}
                close={() => setChowCrop(false)}
                image={imageChos}
                save={SaveImage}
                ratio={1 / 1}
            />
            <section className="hbox stretch">
                <aside className="aside-lg bg-light lter b-r">
                    <section className="vbox">
                        <section className="scrollable">
                            <div className="wrapper panel panel-default">
                                <div className="content">
                                    <div className="profile">
                                        <div {...getRootProps()} className="image_users thumb-lg">
                                            <div className="hover-image">
                                                <Link
                                                    to="#"
                                                    className="icon-image"
                                                    onClick={() => open()}
                                                >
                                                    <i className="icon-picture i-2x text" />
                                                </Link>
                                            </div>
                                            <input {...getInputProps()} />
                                            <img
                                                src={PersonData.foto_path_personal}
                                                className="img-circle"
                                                alt="users_pic"
                                            />
                                        </div>
                                        <div>
                                            <div
                                                className="h3 m-t-xs m-b-xs"
                                                style={{ textAlign: "center" }}
                                            >
                                                {PersonData.fullname}
                                            </div>
                                        </div>
                                        <div className="row text-center">
                                            <div className="col-xs">
                                                <div className="btn-group btn-group-justified m-t editBtn">
                                                    <Link
                                                        to="#"
                                                        className="btn btn-success btn-rounded"
                                                        onClick={() => setEdited(!edited)}
                                                    >
                                                        <i className="icon-pencil" /> Edit Personal
                                                        Data
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        className="btn btn-dark btn-rounded"
                                                        onClick={() => setEditPass(!editPass)}
                                                    >
                                                        <i className="icon-shield" /> Edit Account
                                                        Data
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`form-data pass ${!editPass ? "hide" : ""}`}
                                            data-validate="parsley"
                                        >
                                            <section class="panel panel-default">
                                                <header class="panel-heading">
                                                    <span class="h4">Account Data</span>
                                                </header>
                                                <div class="panel-body">
                                                    <p class="text-muted">
                                                        You can update or fill data bellow
                                                    </p>
                                                    <div class="form-group">
                                                        <label>Username</label>
                                                        <input
                                                            type="text"
                                                            name="username_user"
                                                            class="form-control parsley-validated rounded"
                                                            onChange={ChangeInput}
                                                            disabled={true}
                                                            value={AcountData.username_user}
                                                        />
                                                    </div>
                                                    <div class="form-group pull-in clearfix m-t-md">
                                                        <div class="col-sm-6">
                                                            <label>Email</label>
                                                            <input
                                                                type="text"
                                                                name="email"
                                                                class="form-control parsley-validated rounded"
                                                                data-type="email"
                                                                placeholder="Fill your email here, examp (email@gmail.com) "
                                                                onChange={ChangeAccountInput}
                                                                value={AcountData.email}
                                                            />
                                                        </div>
                                                        <div class="col-sm-6">
                                                            <label>Phone</label>
                                                            <input
                                                                type="text"
                                                                name="telephone"
                                                                class="form-control parsley-validated rounded"
                                                                data-type="phone"
                                                                placeholder="08XX XXXX XXXX"
                                                                onChange={ChangeAccountInput}
                                                                value={AcountData.telephone}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div class="form-group pull-in clearfix m-t-md">
                                                        <div class="col-sm-6">
                                                            <label>New Password</label>
                                                            <input
                                                                name="password"
                                                                type="password"
                                                                class="form-control parsley-validated rounded"
                                                                data-required="true"
                                                                onChange={ChangeAccountInput}
                                                                value={AcountData.password}
                                                            />
                                                        </div>
                                                        <div class="col-sm-6">
                                                            <label>Retype Password</label>
                                                            <input
                                                                name="passwordtes"
                                                                type="password"
                                                                class="form-control parsley-validated rounded"
                                                                data-required="true"
                                                                onChange={ChangeAccountInput}
                                                                value={AcountData.passwordtes}
                                                            />
                                                        </div>
                                                    </div>
                                                    <footer class="panel-footer bg-light lter bawah">
                                                        <div className="text-right">
                                                            <button
                                                                class={`btn btn-success btn-s-xs`}
                                                                onClick={updateAccount}
                                                            >
                                                                SAVE
                                                            </button>
                                                        </div>
                                                        <div
                                                            className={`text-left ${
                                                                isError ? "" : "hide"
                                                            }`}
                                                            style={{ color: "red" }}
                                                        >
                                                            <h4>Password not match</h4>
                                                        </div>
                                                    </footer>
                                                </div>
                                            </section>
                                        </div>
                                        <div className="form-data" data-validate="parsley">
                                            <section className="panel panel-default">
                                                <header className="panel-heading">
                                                    <span className="h4">Personal Data</span>
                                                </header>
                                                <div className="panel-body">
                                                    <p className="text-muted">
                                                        You can update or fill data bellow
                                                    </p>
                                                    <div className="form-group">
                                                        <label>Fullname</label>
                                                        <input
                                                            type="text"
                                                            name="complete_name"
                                                            className="form-control parsley-validated"
                                                            onChange={ChangeInput}
                                                            disabled={!edited}
                                                            value={PersonData.complete_name}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Address</label>
                                                        <input
                                                            type="text"
                                                            name="address"
                                                            className="form-control parsley-validated"
                                                            placeholder="Update you address, examp (Jl. ujung aspal pondok gede)"
                                                            onChange={ChangeInput}
                                                            disabled={!edited}
                                                            value={PersonData.address}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Provinsi</label>
                                                        <Select
                                                            // menuPortalTarget={document.body}
                                                            value={Prov.filter(
                                                                (ops) =>
                                                                    ops.label ===
                                                                    PersonData.userprovinsi
                                                            )}
                                                            styles={selectProfile}
                                                            placeholder="Select Provinsi"
                                                            isDisabled={!edited}
                                                            options={Prov}
                                                            onChange={(id) => {
                                                                const data = {
                                                                    ...PersonData,
                                                                    userprovinsi: id.label,
                                                                    provinsi: id.value,
                                                                }
                                                                SetPersonData(data)
                                                                GetKota(id.value)
                                                            }}
                                                        />
                                                    </div>
                                                    <div className={`form-group`}>
                                                        <label>Kota</label>
                                                        <Select
                                                            // menuPortalTarget={document.body}
                                                            value={Kota.filter(
                                                                (ops) =>
                                                                    ops.label ===
                                                                    PersonData.userkota
                                                            )}
                                                            styles={selectProfile}
                                                            maxMenuHeight={150}
                                                            placeholder={`${
                                                                !KotaShow
                                                                    ? "Select Provinsi First"
                                                                    : "Select Kota"
                                                            }`}
                                                            isDisabled={!edited}
                                                            options={Kota}
                                                            onChange={(id) => {
                                                                const data = {
                                                                    ...PersonData,
                                                                    kota: id.value,
                                                                    userkota: id.label,
                                                                }
                                                                SetPersonData(data)
                                                                GetKecamatan(id.value)
                                                            }}
                                                        />
                                                    </div>
                                                    <div className={`form-group`}>
                                                        <label>Kecamatan</label>
                                                        <Select
                                                            // menuPortalTarget={document.body}
                                                            value={Kecamatan.filter(
                                                                (ops) =>
                                                                    ops.label ===
                                                                    PersonData.userkecamatan
                                                            )}
                                                            styles={selectProfile}
                                                            maxMenuHeight={150}
                                                            placeholder={`${
                                                                !KecamatanShow
                                                                    ? "Select Kota First"
                                                                    : "Select Kecamatan"
                                                            }`}
                                                            isDisabled={!edited}
                                                            options={Kecamatan}
                                                            onChange={(id) => {
                                                                const data = {
                                                                    ...PersonData,
                                                                    kecamatan: id.value,
                                                                    userkecamatan: id.label,
                                                                }
                                                                SetPersonData(data)
                                                                GetKelurahan(id.value)
                                                            }}
                                                        />
                                                    </div>
                                                    <div className={`form-group`}>
                                                        <label>Kelurahan</label>
                                                        <Select
                                                            // menuPortalTarget={document.body}
                                                            value={Kelurahan.filter(
                                                                (ops) =>
                                                                    ops.label ===
                                                                    PersonData.userkelurahan
                                                            )}
                                                            styles={selectProfile}
                                                            maxMenuHeight={150}
                                                            placeholder={`${
                                                                !KelurahanShow
                                                                    ? "Select Kecamatan First"
                                                                    : "Select Kelurahan"
                                                            }`}
                                                            isDisabled={!edited}
                                                            options={Kelurahan}
                                                            onChange={(id) => {
                                                                const data = {
                                                                    ...PersonData,
                                                                    kelurahan: id.value,
                                                                    userkelurahan: id.label,
                                                                }
                                                                SetPersonData(data)
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Birth Day</label>
                                                        <MyDate
                                                            value={
                                                                PersonData.tanggal_lahir_personal
                                                            }
                                                            disabled={!edited}
                                                            set={setDateLahir}
                                                        />
                                                    </div>
                                                </div>
                                                <footer className="panel-footer text-right bg-light lter">
                                                    <button
                                                        onClick={updateData}
                                                        className={`btn btn-success btn-s-xs ${
                                                            edited ? "" : "hide"
                                                        }`}
                                                    >
                                                        SAVE
                                                    </button>
                                                </footer>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </section>
                </aside>
            </section>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        users: state.users,
        tokens: state.users.token,
    }
}

export default connect(mapStateToProps)(User)
