import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import Pay from "redux/actions/payment"
import times from "redux/actions/timer"
import logger from "helpers/logs"

class Timer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            second: 0,
            duration: 60,
            minute: 0,
            initMinute: 5,
            do: false,
            complete: false,
        }
        this.log = new logger(true, "timer")
    }

    componentDidMount() {
        this.start()
    }

    componentWillUnmount() {
        clearInterval(this.id)
    }

    start = () => {
        const { running, stops, minute, second } = this.props.timers

        if (stops) {
            // this.props.stoptimer()
            clearInterval(this.id)
        } else if (running) {
            this.setState({
                minute: minute,
                second: second,
                complete: false,
                do: true,
            })
            this.id = setInterval(this.initiate, 1000)
        } else {
            this.setState({
                minute: this.state.initMinute,
                second: this.state.duration,
                complete: false,
                do: true,
            })
            this.id = setInterval(this.initiate, 1000)
        }
    }

    initiate = () => {
        if (this.state.second !== 0) {
            this.setState((prevState, prevProps) => ({
                second: prevState.second - 1,
            }))
            if (this.state.second === 0 && this.state.minute !== 0) {
                this.setState((prevState, prevProps) => ({
                    minute: prevState.minute - 1,
                    second: this.state.duration,
                }))
            }
            this.props.savetimer(this.state.minute, this.state.second)
            if (this.state.minute === 0 && this.state.second === 0) {
                this.props.stoptimer()
                this.props.unsetpay()
                clearInterval(this.id)
                this.setState({ complete: true, do: false })
            }
        }
    }

    render() {
        return (
            <>
                {`0${this.state.minute} : ${
                    this.state.second < 10 ? "0" + this.state.second : this.state.second
                }`}
            </>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        runtimer: bindActionCreators(times.RunTimer, dispatch),
        stoptimer: bindActionCreators(times.ResetTimer, dispatch),
        savetimer: bindActionCreators(times.SaveTimer, dispatch),
        unsetpay: bindActionCreators(Pay.ResetPay, dispatch),
    }
}

const mapStateToProps = (state) => {
    return {
        timers: state.timers,
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Timer)
