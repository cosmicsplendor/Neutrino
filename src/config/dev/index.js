import createConfig from "../create"
import LocStorage from "../../helpers/storage/strategies/LocStorage"

const testMode = true
const overrides = {
    SDKStrat: null,
    StorageStrat: LocStorage,
    showAdOnRestart: 0,
    showAdOnResume: 0,
    prerollAd: false,
    testMode: testMode,
    debug: false
}

export default createConfig(overrides)