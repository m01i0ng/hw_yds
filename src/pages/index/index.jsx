import {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import './index.scss'
import {ClButton, ClCard, ClForm, ClFormItem, ClInput, ClMessage, ClText} from "mp-colorui";

export default class Index extends Component {

  state = {
    bg: 0,
    weight: 0,
    target: 0,
    result: 0,
    msg: '',
    show: false
  }

  config = {
    navigationBarTitleText: '胰岛素剂量校正'
  }

  compute = () => {
    const {bg, weight, target} = this.state
    let msg

    if (!weight) {
      msg = '请输入 患者体重'
      this.setState({msg, show: true})
      return
    } else if (!bg) {
      msg = '请输入 现测血糖值'
      this.setState({msg, show: true})
      return
    } else if (!target) {
      msg = '请输入 目标血糖值'
      this.setState({msg, show: true})
      return
    }

    const result = ((bg - target) / (3000 / weight * 18)).toFixed(6);

    this.setState({
      result
    })
  }

  render() {
    return (
      <View className='index'>
        <ClMessage message={this.state.msg} show={this.state.show} type='warn'
                   onClose={() => this.setState({show: false})}/>
        <ClCard>
          <ClText textColor='blue' size='large'>
            计算方式：
          </ClText>
          <ClText>
            校正系数 = 3000 / 患者的体重 x 18
          </ClText>
          <ClText>
            校正胰岛素剂量 = (现测血糖值 - 目标血糖值) / 校正系数
          </ClText>
        </ClCard>
        <ClCard>
          <ClText>结果：</ClText>
          <ClText size='xslarge'>{this.state.result}</ClText>
        </ClCard>
        <ClCard>
          <ClForm>
            <ClFormItem required prop='weight' autoFocus>
              <ClInput title='患者体重：' placeholder='kg' type='digit' clear adjustPosition
                       onChange={value => this.setState({weight: value})}/>
            </ClFormItem>
            <ClFormItem required prop='bg'>
              <ClInput title='现测血糖值：' placeholder='mmol/L' type='digit' clear adjustPosition
                       onChange={value => this.setState({bg: value})}/>
            </ClFormItem>
            <ClFormItem required prop='target'>
              <ClInput title='目标血糖值：' placeholder='mmol/L' type='digit' clear adjustPosition
                       onChange={value => this.setState({target: value})}/>
            </ClFormItem>
          </ClForm>
        </ClCard>
        <ClCard>
          <ClButton shape='round' long onClick={this.compute}>计算</ClButton>
        </ClCard>
      </View>
    )
  }
}
