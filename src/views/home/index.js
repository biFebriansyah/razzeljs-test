import "./css/style.scoped.css"
import React, { Component } from "react"
import Cards from "components/_Crads"
import Discover from "components/_Discovery"
import Newsongs from "components/Newsong/index"
import Trend from "components/Trending/Trending"
import Topsongs from "components/Topsongs"
import TopArtis from "components/TopArtis"
import Options from "components/OpsiBellow"
import Slider from "views/Coursel"
import { connect } from "react-redux"
import { logout } from "redux/actions/users"
import { bindActionCreators } from "redux"
import { OptionsContext } from "helpers/contex"
import api from "helpers/api"
import Loader from "components/loaderCards/LoaderCards"
import HelmetMeta from "views/Helmet"
import logs from "helpers/logs"

class Index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Data: [],
            count: 24,
            sideShow: false,
            isActive: false,
            IsOutisde: false,
            theId: 0,
            curentRefPlay: "",
            curentRefHov: "",
            angka: 0,
            isLoad: false,
        }
        this.currentPathname = null
        this.logger = new logs(false, "home")
    }

    static contextType = OptionsContext

    componentWillUnmount() {
        this.context.setTheme("bg-black", true)
    }

    togelClass = () => {
        this.setState({
            sideShow: !this.state.sideShow,
        })
    }

    getPage = () => {
        const apis = new api(this.props.tokens)
        return new Promise((resolve, reject) => {
            apis.req({
                method: "GET",
                url: "music/discovery?page=1&per_page=1",
            })
                .then((res) => {
                    const { pagination } = res.data.meta
                    resolve(pagination.total_page)
                })
                .catch((er) => {
                    reject(new Error("Failed get pagination"))
                })
        })
    }

    getDiscovery = (paginate) => {
        const apis = new api(this.props.tokens)
        return new Promise((resolve, reject) => {
            apis.req({
                method: "GET",
                url: `music/discovery?page=1&per_page=${paginate}&order[id]=ASC`,
            })
                .then((res) => {
                    const { data } = res.data
                    resolve(data)
                })
                .catch((er) => {
                    reject(er.response)
                })
        })
    }

    veriVyToken = () => {
        const apis = new api(this.props.tokens)
        return new Promise((resolve, reject) => {
            apis.req({
                method: "GET",
                url: `auth?include=personal,label,role&page=1&per_page=5`,
            })
                .then(() => {
                    resolve(true)
                })
                .catch((er) => {
                    if (er.response) {
                        // console.log(er.response.data.message)
                        if (
                            er.response.data.message ===
                            "Token yang diberikan telah habis masa kadaluarsa"
                        ) {
                            this.props.unsetAuth()
                        }
                    }
                    reject(false)
                })
        })
    }

    async componentDidMount() {
        try {
            this.setState({ isLoad: true })
            const page = await this.getPage()
            const data = await this.getDiscovery(page)
            this.setState({ Data: data, isLoad: false })
            await this.veriVyToken()
        } catch (error) {
            // this.logger(error.response)
            new logs(true, "home").Show(error)
        }
    }

    CardsPlay = (id, refsPlay, refsHov, songs) => {
        const numb = this.state.angka + 1
        if (id !== this.state.theId) {
            this.setState({
                curentRefHov: refsHov,
                curentRefPlay: refsPlay,
                theId: id,
                angka: numb,
            })
            this.context.setTheSongs(songs)
        } else {
            this.setState({ theId: 0, angka: numb })
            this.context.setTheSongs(songs)
        }
    }

    render() {
        return (
            <section className="scrollable padder-lg w-f-md">
                <HelmetMeta
                    title="Musicfly - Listen free music"
                    desc="Discovery our music maybe you will find your type and listen for it. your happy is our happiness"
                    img="https://res.cloudinary.com/devops2/image/upload/v1618237589/musicfly/logo_ekro0x.png"
                    imgalt="muscifly-logo"
                />
                <Slider />
                <div className="dicover">
                    <Discover />
                </div>
                <div className="row row-sm cards-container">
                    {this.state.isLoad
                        ? Array(this.state.count)
                              .fill()
                              .map((_, index) => {
                                  return <Loader key={index} />
                              })
                        : this.state.Data.map((value) => {
                              const data = {
                                  id: value.id,
                                  uuid: value.discovery_code,
                                  name: value.music_title,
                                  code: value.music_code,
                                  artisCod: value.artis_code,
                                  singer: value.artis_complete_name,
                                  cover: value.music_image_priority,
                                  duration: value.music_duration,
                                  musicSrc: value.music_storage_path,
                              }
                              return (
                                  <Cards
                                      key={data.id}
                                      idx={data.id}
                                      name={data.name}
                                      code={data.code}
                                      artiscod={data.artisCod}
                                      cover={data.cover}
                                      singer={data.singer}
                                      duration={data.duration}
                                      loved={value.love_id}
                                      songs={data}
                                      isActive={this.state.isActive}
                                      playCard={this.CardsPlay}
                                      history={this.props.history}
                                  />
                              )
                          })}
                </div>
                <Newsongs />
                <div className="row">
                    <Trend />
                    <Topsongs />
                    <TopArtis />
                </div>
                <Options />
            </section>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        unsetAuth: bindActionCreators(logout, dispatch),
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.users,
        tokens: state.users.token,
        isAuth: state.users.isAuth,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
