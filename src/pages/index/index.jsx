import {useEffect, useState} from '@tarojs/taro'
import {View} from '@tarojs/components'
import './index.scss'
import {ClButton, ClCard, ClForm, ClFormItem, ClInput, ClMessage, ClText, ClTitleBar} from "mp-colorui";

const Index = () => {
  // 计算元数据
  const [bg, setBg] = useState(0)
  const [target, setTarget] = useState(0)
  const [weight, setWeight] = useState(0)
  const [tdd, setTdd] = useState(0)
  const [result, setResult] = useState('0')
  // 其他状态
  const [msg, setMsg] = useState('')
  const [mode, setMode] = useState('')
  const [msgShow, setMsgShow] = useState(false)

  useEffect(() => {
    if (mode === 'unknown') {
      if (bg && target && weight) {
        compute()
      }
    } else {
      if (bg && target && tdd) {
        compute()
      }
    }
  })

  useEffect(() => {
    return () => {
      clear()
    }
  }, [])

  const compute = () => {
    let msg;

    if (mode === 'unknown') {
      if (!bg) {
        msg = '请输入 现测血糖值'
        setMsg(msg)
        setMsgShow(true)
        return
      }
      if (!target) {
        msg = '请输入 目标血糖值'
        setMsg(msg)
        setMsgShow(true)
        return;
      }
      if (!weight) {
        msg = '请输入 患者体重';
        setMsg(msg);
        setMsgShow(true);
        return;
      }

      const cf = 3000 / (weight * 18);
      const result = ((bg - target) / cf).toFixed(1);

      setResult(result);
    } else if (mode === 'known') {
      if (!bg) {
        msg = '请输入 现测血糖值'
        setMsg(msg)
        setMsgShow(true)
        return;
      }
      if (!target) {
        msg = '请输入 目标血糖值'
        setMsg(msg)
        setMsgShow(true)
        return;
      }
      if (!tdd) {
        msg = '请输入 日总剂量'
        setMsg(msg)
        setMsgShow(true)
        return;
      }

      const cf = 1700 / (tdd * 18);
      const result = ((bg - target) / cf).toFixed(1)

      setResult(result)
    }
  }

  const modeSwitch = mode => {
    setMode(mode)
    clear()
  }

  const clear = () => {
    setBg(0)
    setTarget(0)
    setWeight(0)
    setTdd(0)
    setResult('0')
  }

  return (
    <View className='index'>
      {
        mode ? (
          <View className='main'>
            <ClMessage message={msg} show={msgShow} type='warn'
                       onClose={() => setMsgShow(false)}/>
            <ClCard>
              <ClText>结果：</ClText>
              <ClText align='center' size='xslarge' text={result}/>
            </ClCard>
            <ClCard>
              <ClForm>
                <ClTitleBar title='现测血糖值(mmol/L)' type='icon' icon='triangledownfill' iconColor='blue' bgColor='blue'
                            textColor='white'
                            borderColor='light-blue'/>
                <ClFormItem required prop='bg'>
                  <ClInput value={bg || ''} type='digit' adjustPosition
                           autoFocus
                           onChange={value => setBg(Number(value))}/>
                </ClFormItem>
                <View style={{height: '10px'}}/>
                <ClTitleBar title='目标血糖值(mmol/L)' type='icon' icon='triangledownfill' iconColor='blue' bgColor='blue'
                            textColor='white'
                            borderColor='light-blue'/>
                <ClFormItem required prop='bg'>
                  <ClInput value={target || ''} type='digit' adjustPosition
                           onChange={value => setTarget(Number(value))}/>
                </ClFormItem>
                <View style={{height: '10px'}}/>
                {
                  mode === 'unknown' ? (
                    <View>
                      <ClTitleBar title='患者体重(kg)' type='icon' icon='triangledownfill' iconColor='blue' bgColor='blue'
                                  textColor='white' borderColor='light-blue'/>
                      <ClFormItem required prop='weight' autoFocus>
                        <ClInput value={weight || ''} type='digit' adjustPosition
                                 onChange={value => setWeight(Number(value))}/>
                      </ClFormItem>
                    </View>
                  ) : (
                    <View>
                      <ClTitleBar title='日总剂量(IU)' type='icon' icon='triangledownfill' iconColor='blue' bgColor='blue'
                                  textColor='white' borderColor='light-blue'/>
                      <ClFormItem required prop='tdd'>
                        <ClInput value={tdd || ''} type="digit" adjustPosition
                                 onChange={value => setTdd(Number(value))}/>
                      </ClFormItem>
                    </View>
                  )
                }
              </ClForm>
            </ClCard>
            <ClCard>
              <ClButton shadow shape='round' bgColor='red' long onClick={clear}>清空</ClButton>
              <View style={{height: '10px'}}/>
              <ClButton shadow shape='round' long
                        onClick={() => setMode('')}>返回(当前：{mode === 'unknown' ? '未知' : '已知'}总剂量)</ClButton>
            </ClCard>
          </View>
        ) : (
          <View className='mode-container'>
            <ClButton size='large' shadow shape="round" text='未知胰岛素总剂量' onClick={() => modeSwitch('unknown')} long/>
            <ClText size='normal' align='center'>1. 以前未使用胰岛素但已被确诊为糖尿病</ClText>
            <ClText size='normal' align='center'>2. 之前胰岛素剂量未知/不清楚</ClText>
            <View style={{height: '10px'}}/>
            <ClButton size='large' shadow shape="round" text='已知胰岛素总剂量' long onClick={() => modeSwitch('known')}/>
          </View>
        )
      }
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '胰岛素剂量校正'
}

export default Index
