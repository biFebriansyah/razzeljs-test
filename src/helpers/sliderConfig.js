export const SliderSet = (args) => {
    const railthm = args === "bg-black" ? "#4d5d6e" : args === "bg-dark" ? "#36b0c8" : "#2ad980"
    const trackTheme = args === "bg-black" ? "#778490" : args === "bg-dark" ? "#78c3d2" : "#15a25a"
    const dotsTheme = args === "bg-black" ? "#778490" : args === "bg-dark" ? "#78c3d2" : "#15a25a"
    const object = {
        railStyle: {
            backgroundColor: railthm,
            height: "60px",
            borderRadius: "0px",
        },
        trackStyle: {
            backgroundColor: trackTheme,
            height: "60px",
            borderRadius: "0px",
        },
        dotStyle: {
            backgroundColor: dotsTheme,
            borderColor: "#778490",
            border: "none",
            height: "60px",
            borderRadius: "0px",
            marginTop: "0px",
        },
    }
    return object
}

export const adsSlider = {
    railStyle: {
        backgroundColor: "#545ca6",
        height: "60px",
        borderRadius: "0px",
    },
    trackStyle: {
        backgroundColor: "#666DAD",
        height: "60px",
        borderRadius: "0px",
    },
    dotStyle: {
        backgroundColor: "#666DAD",
        borderColor: "#797FB4",
        border: "none",
        height: "60px",
        borderRadius: "0px",
        marginTop: "0px",
    },
}

export const adsVolume = {
    railStyle: {
        backgroundColor: "#545ca6",
        height: "6px",
        borderRadius: "0px",
    },
    trackStyle: {
        backgroundColor: "#666DAD",
        height: "6px",
        borderRadius: "0px",
    },
    dotStyle: {
        backgroundColor: "#666DAD",
        borderColor: "#797FB4",
        border: "none",
        height: "6px",
        width: "5px",
        borderRadius: "0px",
        marginTop: "0px",
    },
}

export const VolumeSet = (args) => {
    const railthm = args === "bg-black" ? "#4d5d6e" : args === "bg-dark" ? "#36b0c8" : "#2ad980"
    const trackTheme = args === "bg-black" ? "#778490" : args === "bg-dark" ? "#78c3d2" : "#15a25a"
    const dotsTheme = args === "bg-black" ? "#778490" : args === "bg-dark" ? "#78c3d2" : "#15a25a"
    const object = {
        railStyle: {
            backgroundColor: railthm,
            height: "6px",
            borderRadius: "0px",
        },
        trackStyle: {
            backgroundColor: trackTheme,
            height: "6px",
            borderRadius: "0px",
        },
        dotStyle: {
            backgroundColor: dotsTheme,
            borderColor: "#778490",
            border: "none",
            height: "6px",
            width: "5px",
            borderRadius: "0px",
            marginTop: "0px",
        },
    }
    return object
}

export const SliderConfig = {
    min: 0,
    step: 0.01,
}
