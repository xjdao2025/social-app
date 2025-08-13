import {useContext, useState} from 'react'
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {Image} from 'expo-image'
import {useBoolean, useRequest} from 'ahooks'
import {Dropdown} from 'antd'
import {Popup} from 'antd-mobile'
import dayjs from 'dayjs'

import {extractAssetUrl} from '#/lib/extractAssetUrl'
import {isRealMobileWeb} from '#/platform/detection'
import {Button, ButtonText} from '#/components/Button'
import ExpandRightIcon from '#/components/DAO/icons/expand-right'
import server from '#/server'
import {PostFeedFilterContext} from '../context'

type Props = {
  title: string
}

export function Nodes(props: Props) {
  const [state, setState] = useContext(PostFeedFilterContext)
  const {value} = state.node ?? {}

  const [visible, setVisible] = useBoolean(false)

  const {data: nodeList} = useRequest(async () => server.dao('POST /node/list'))

  const [candidate, setCandidate] =
    useState<APIDao.WebEndpointsNodeNodeListVo>()

  return (
    <>
      <Dropdown
        menu={{
          activeKey: candidate?.nodeId,
          items: nodeList?.map(node => {
            return {
              key: node.nodeId,
              label: (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 4,
                    minWidth: 200,
                    height: 24,
                  }}>
                  <Image
                    accessibilityIgnoresInvertColors
                    style={{width: 16, height: 16, borderRadius: 8}}
                    source={{
                      uri: extractAssetUrl(node.logo),
                    }}
                  />
                  <Text>{node.name}</Text>
                </View>
              ),
            }
          }),
          onClick: info => {
            const {key} = info
            const node = nodeList!.find(node => node.nodeId === key)!
            setState({
              node: {
                label: node.name,
                value: {
                  ...node,
                  userDid: node.userDid || 'repo_not_set',
                },
              },
            })
          },
        }}
        trigger={['click', 'contextMenu']}
        open={!isRealMobileWeb && visible}
        onOpenChange={setVisible.set}>
        <Pressable
          accessibilityRole="button"
          style={[S.selector, !!value && S.selected]}
          onPress={setVisible.setTrue}>
          {value ? (
            <>
              <Image
                accessibilityIgnoresInvertColors
                style={{width: 16, height: 16, borderRadius: 8}}
                source={{
                  uri: extractAssetUrl(value.logo),
                }}
              />
              <Text numberOfLines={1} style={{maxWidth: 120}}>
                {value.name}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={event => {
                  event.stopPropagation()
                  setState({
                    node: undefined,
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
              <Text>按节点筛选</Text>
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

          <Text style={S.modalSubTitle}>按节点筛选</Text>

          <ScrollView style={S.nodeList}>
            {nodeList?.map(node => {
              return (
                <Pressable
                  accessibilityRole="button"
                  key={node.nodeId}
                  style={[
                    S.nodeItem,
                    candidate?.nodeId === node.nodeId && S.selectedItem,
                  ]}
                  onPress={() => {
                    setCandidate({
                      ...node,
                      userDid: node.userDid || 'repo_not_set',
                    })
                  }}>
                  <Image
                    accessibilityIgnoresInvertColors
                    style={{width: 28, height: 28, borderRadius: 14}}
                    source={{
                      uri: extractAssetUrl(node.logo),
                    }}
                  />
                  <Text style={S.nodeName}>{node.name}</Text>
                </Pressable>
              )
            })}
          </ScrollView>

          <View style={S.operations}>
            <Button
              style={[S.button, S.buttonReset]}
              label="cancel"
              variant="outline"
              onPress={() => setCandidate(undefined)}>
              <ButtonText style={{color: '#0B0F14'}}>重置</ButtonText>
            </Button>
            <Button
              style={S.button}
              label="confirm"
              variant="solid"
              color="primary"
              onPress={() => {
                setState({
                  node: {
                    value: candidate,
                    label: candidate?.name,
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
  nodeList: {
    maxHeight: Dimensions.get('screen').height / 3,
    display: 'flex',
    flexDirection: 'column',
    marginTop: 6,
  },
  nodeItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#F1F3F5',
    gap: 6,
  },
  nodeName: {
    color: '#0B0F14',
    fontSize: 16,
    fontWeight: 400,
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: '#1083FE',
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
