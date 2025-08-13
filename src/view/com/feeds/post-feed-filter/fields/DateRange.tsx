import {useContext, useState} from 'react'
import {Pressable, StyleSheet, Text, View} from 'react-native'
import {Image} from 'expo-image'
import {useBoolean, useLatest} from 'ahooks'
import {DatePicker,Dropdown} from 'antd'
import {Popup} from 'antd-mobile'
import dayjs from 'dayjs'

import {isRealMobileWeb} from '#/platform/detection'
import {Button, ButtonText} from '#/components/Button'
import ExpandRightIcon from '#/components/DAO/icons/expand-right'
import {PostFeedFilterContext} from '../context'
import {DateRangePicker} from './DateRangePicker'

const {RangePicker} = DatePicker

const options = [
  {
    key: '1',
    label: '近1个月',
    value: 1,
  },
  {
    key: '3',
    label: '近3个月',
    value: 3,
  },
  {
    key: '6',
    label: '近6个月',
    value: 6,
  },
]

type Props = {
  title: string
}

export function DateRange(props: Props) {
  const [state, setState] = useContext(PostFeedFilterContext)
  const {label, value} = state.date ?? {}

  const [visible, setVisible] = useBoolean(false)

  const [selectMode, setSelectMode] = useState<'month' | 'custom'>()
  const [months, setMonths] = useState<string | number>()

  const [candidate, setCandidate] = useState<[dayjs.Dayjs, dayjs.Dayjs]>()

  const [pickerVisible, setPickerVisible] = useBoolean(false)

  return (
    <>
      <Dropdown
        menu={{
          activeKey: String(months),
          items: [
            ...options,
            {
              key: 'custom',
              label: (
                <>
                  <View style={{width: 80}}>
                    <Text>自定义</Text>
                  </View>
                  <View style={{width: 0, height: 0, overflow: 'hidden'}}>
                    <RangePicker
                      open={pickerVisible}
                      onOpenChange={setPickerVisible.set}
                      onChange={v => {
                        setPickerVisible.setFalse()
                        setState({
                          date: {
                            label:
                              v[0].format('YYYY-MM-DD') +
                              '--' +
                              v[1].format('YYYY-MM-DD'),
                            value: [dayjs(v[0]), dayjs(v[1])],
                          },
                        })
                        setTimeout(setVisible.setFalse)
                      }}
                    />
                  </View>
                </>
              ),
            },
          ],
          onClick: info => {
            const {key} = info
            if (key === 'custom') {
              !pickerVisible && setPickerVisible.setTrue()
              return
            }

            const end = dayjs()
            const start = dayjs().subtract(+key, 'month')
            setState({
              date: {
                label: '近' + key + '个月',
                value: [start, end],
              },
            })
            setVisible.setFalse()
          },
        }}
        trigger={['click', 'contextMenu']}
        open={!isRealMobileWeb && visible}
        onOpenChange={(open, info) => {
          if (pickerVisible) return
          if (info.source === 'menu') return
          setVisible.set(open)
        }}>
        <Pressable
          accessibilityRole="button"
          style={[S.selector, !!value && S.selected]}
          onPress={setVisible.toggle}>
          {value ? (
            <>
              <Text>{label}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={event => {
                  event.stopPropagation()
                  setState({
                    date: undefined,
                  })
                }}>
                <Image
                  accessibilityIgnoresInvertColors
                  style={{width: 16, height: 16}}
                  source={require('#/assets/close-rounded.svg')}
                />
              </Pressable>
            </>
          ) : (
            <>
              <Text>按时间筛选</Text>
              <ExpandRightIcon
                style={{rotate: '90deg'}}
                color="#42576C"
                size={16}
              />
            </>
          )}
        </Pressable>
      </Dropdown>

      <Popup
        visible={isRealMobileWeb && visible}
        onClose={setVisible.setFalse}
        bodyStyle={{background: 'transparent'}}>
        <View style={S.modalWrap}>
          <View style={S.modalHeader}>
            <Text style={S.modalTitle}>{props.title}筛选</Text>
            <Pressable accessibilityRole="button" onPress={setVisible.setFalse}>
              <Image
                accessibilityIgnoresInvertColors
                style={{width: 16, height: 16}}
                source={require('#/assets/close.svg')}
              />
            </Pressable>
          </View>

          <Text style={S.modalSubTitle}>按时间筛选</Text>

          <View style={S.optionsContainer}>
            {options.map(option => {
              const {label, value} = option
              return (
                <Pressable
                  accessibilityRole="button"
                  key={label}
                  style={[
                    S.option,
                    selectMode === 'month' && months === value && S.selected,
                  ]}
                  onPress={() => {
                    setSelectMode('month')
                    setMonths(value)
                    const end = dayjs()
                    const start = dayjs().subtract(value, 'month')
                    setCandidate([start, end])
                  }}>
                  <Text>{label}</Text>
                </Pressable>
              )
            })}
          </View>

          <DateRangePicker
            active={selectMode === 'custom'}
            value={selectMode === 'custom' ? candidate : undefined}
            onChange={value => {
              setSelectMode('custom')
              setMonths(undefined)
              setCandidate(value)
            }}
          />

          <View style={S.operations}>
            <Button
              style={[S.button, S.buttonReset]}
              label="cancel"
              variant="outline"
              onPress={() => {
                setMonths(undefined)
                setSelectMode(undefined)
                setCandidate(undefined)
              }}>
              <ButtonText style={{color: '#0B0F14'}}>重置</ButtonText>
            </Button>
            <Button
              style={S.button}
              label="confirm"
              variant="solid"
              color="primary"
              disabled={!(!candidate || (!!candidate[0] && !!candidate[1]))}
              onPress={() => {
                setState({
                  date: {
                    value: candidate,
                    label: candidate
                      ? selectMode === 'custom'
                        ? candidate![0].format('YYYY/MM/DD') +
                          '--' +
                          candidate![1].format('YYYY/MM/DD')
                        : '近' + months + '个月'
                      : '',
                  },
                })
                setVisible.setFalse()
              }}>
              <ButtonText>确定</ButtonText>
            </Button>
          </View>
        </View>
      </Popup>
    </>
  )
}

const S = StyleSheet.create({
  selector: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F1F3F5',
    width: 'fit-content',
    height: 30,
    borderRadius: 15,
    cursor: 'pointer',
    gap: 2,
  },
  selected: {
    backgroundColor: 'rgba(16, 131, 254, 0.10)',
  },
  modalWrap: {
    backgroundColor: '#fff',
    padding: 16,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B0F14',
  },
  modalSubTitle: {
    fontSize: 14,
    fontWeight: 400,
    color: '#0B0F14',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    rowGap: 10,
    columnGap: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  option: {
    flex: 1,
    height: 38,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: '#F1F3F5',
  },
  operations: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 36,
    gap: 10,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 8,
  },
  buttonReset: {
    borderWidth: 1,
    borderColor: '#D4DBE2',
  },
})
