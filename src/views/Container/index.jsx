import React, { Component } from "react"
import Header from "components/Header"
import Sidebar from "components/Sidebar"
import Modal from "components/modal/index"
import Search from "views/Seacrh/index"
import HelmetMeta from "views/Helmet"
// import Compare from "fast-deep-equal"
import CreateList from "components/CreatePlayList/CreateList"
import UploadStrcuk from "components/UploadStruck/Upload"
import ChooseList from "components/ChooseList/index"
import api from "helpers/api"
import { OptionsContext, TestContext } from "helpers/contex"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { login, getUsers, setPremium } from "redux/actions/users"
// import { ToastProvider } from "react-toast-notifications"
import Footer from "components/AudioPlayer/index"
import ModalNotfi from "components/ModalNotif/ModalNotfi"

class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sideShow: true,
            isHome: true,
            SideTheme: "bg-black",
            showModal: false,
            showToast: false,
            textToast: "",
            newList: 0,
            createList: false,
            updateListId: null,
            choiceList: false,
            showNotif: false,
            uploads: false,
            musicCode: "",
            sideMobile: false,
            theSongs: {},
            playWithIndex: {},
            onSeacrh: false,
            cariKata: "",
            indexSong: {},
            deletList: {},
            metaTitle: "Musicfly - Listen free music",
            metaDesc:
                "Discovery our music maybe you will find your type and listen for it. your happy that our happiness",
            metaImg:
                "https://res.cloudinary.com/devops2/image/upload/v1618237589/musicfly/logo_ekro0x.png",
            metaAlt: "muscifly-logo",
        }
    }

    componentDidMount() {
        if (!this.props.isPremium) {
            this.setModal()
        }
    }

    setModal = () => {
        this.setState({ showModal: !this.state.showModal })
    }

    setCreateList = (id = null) => {
        this.setState({ createList: !this.state.createList, updateListId: id })
    }

    setUploads = () => {
        this.setState({ uploads: !this.state.uploads })
    }

    setChooiceList = (code) => {
        this.setState({ choiceList: !this.state.choiceList, musicCode: code })
    }

    changeListLength = (listLength) => {
        this.setState({ newList: listLength })
    }

    setTheSongs = (songs) => {
        this.setState({ theSongs: songs })
    }

    setShowToast = (text) => {
        this.setState({ showToast: true, textToast: text }, () => {
            setTimeout(() => {
                this.setState({ showToast: false })
            }, 6000)
        })
    }

    togelClass = () => {
        this.setState({
            sideShow: !this.state.sideShow,
        })
    }

    togleMobile = () => {
        this.setState({
            sideMobile: !this.state.sideMobile,
        })
    }

    setOnSeacrh = (bol) => {
        this.setState({ onSeacrh: bol })
    }

    setCariKata = (val) => {
        let bool = true
        if (val === "") {
            bool = false
        }
        this.setState({ cariKata: val, onSeacrh: bool })
    }

    setTheme = (theme, ishome) => {
        this.setState({ SideTheme: theme, isHome: ishome })
    }

    setMeta = (meta) => {
        this.setState({
            metaTitle: meta.title,
            metaDesc: meta.desc,
            metaImg: meta.img,
            metaAlt: meta.imgalt,
        })
    }

    changeIndexSongs = (idx) => {
        this.setState({ indexSong: idx })
    }

    playingIndex = (data) => {
        this.setState({ playWithIndex: data })
    }

    onDeletList = (data) => {
        this.setState({ deletList: data })
    }

    ShowNotif = () => {
        this.setState({ showNotif: !this.state.showNotif })
    }

    setUsers = () => {
        new api(this.props.tokens)
            .req({
                method: "GET",
                url: `auth?include=personal&page=1&per_page=5`,
            })
            .then((res) => {
                const { data } = res.data
                const users = data[0].personal
                this.props.setUsers(users)
                this.props.setPrem(Boolean(users.premium_status_personal))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // TODO Sidebar need get data from redux
    render() {
        return (
            <OptionsContext.Provider
                value={{
                    setTheme: this.setTheme,
                    createList: this.setCreateList,
                    choiceList: this.setChooiceList,
                    showToast: this.setShowToast,
                    ShowUploads: this.setUploads,
                    changeList: this.changeListLength,
                    showSide: this.state.sideShow,
                    theme: this.state.SideTheme,
                    newList: this.state.newList,
                    UpdateUser: this.setUsers,
                    setMeta: this.setMeta,
                    songidx: this.state.indexSong,
                    showNotif: this.ShowNotif,
                }}
            >
                <TestContext.Provider
                    value={{
                        indexSongs: this.state.indexSong,
                        setIndex: this.changeIndexSongs,
                        playWithIndex: this.state.playWithIndex,
                        setPlayIndex: this.playingIndex,
                        deletList: this.state.deletList,
                        onDeletList: this.onDeletList,
                    }}
                >
                    <div className="app">
                        <HelmetMeta
                            title={this.state.metaTitle}
                            desc={this.state.metaDesc}
                            img={this.state.metaImg}
                            imgalt={this.state.metaAlt}
                        />
                        <section className="vbox">
                            <Modal open={this.state.showModal} toggleModal={this.setModal} />
                            {this.props.isAuth ? (
                                <>
                                    <CreateList
                                        open={this.state.createList}
                                        id={this.state.updateListId}
                                        toggleModal={this.setCreateList}
                                    />
                                    <ModalNotfi
                                        open={this.state.showNotif}
                                        toggleModal={this.ShowNotif}
                                    />
                                    <UploadStrcuk
                                        open={this.state.uploads}
                                        toggleModal={this.setUploads}
                                    />
                                    <ChooseList
                                        open={this.state.choiceList}
                                        toggleModal={this.setChooiceList}
                                        music={this.state.musicCode}
                                    />
                                </>
                            ) : null}
                            <Header
                                func={this.togelClass}
                                show={this.state.sideShow}
                                mobileShow={this.togleMobile}
                                theme={this.state.SideTheme}
                                showToast={this.state.showToast}
                                textToast={this.state.textToast}
                                onSeacrh={this.setOnSeacrh}
                                kata={this.state.cariKata}
                                setKata={this.setCariKata}
                            />

                            <section>
                                <section className="hbox stretch">
                                    <Sidebar
                                        show={this.state.sideShow}
                                        theme={this.state.SideTheme}
                                        home={this.state.isHome}
                                        mobile={this.state.sideMobile}
                                        onSeacrh={this.setOnSeacrh}
                                        kata={this.state.cariKata}
                                        setKata={this.setCariKata}
                                    />
                                    <section id="content">
                                        <section className="vbox">{this.props.children}</section>
                                    </section>
                                </section>
                            </section>
                        </section>
                    </div>
                </TestContext.Provider>
            </OptionsContext.Provider>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAuth: bindActionCreators(login, dispatch),
        setUsers: bindActionCreators(getUsers, dispatch),
        setPrem: bindActionCreators(setPremium, dispatch),
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.users,
        tokens: state.users.token,
        isAuth: state.users.isAuth,
        isPremium: state.users.premium,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
