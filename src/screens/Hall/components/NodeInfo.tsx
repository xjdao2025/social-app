import {type ReactNode} from 'react'
import {StyleSheet, View} from 'react-native'
import {Image} from 'expo-image'

import {extractAssetUrl} from '#/lib/extractAssetUrl'
import {atoms as a} from '#/alf'
import Popup from '#/components/Popup'
import {Text} from '#/components/Typography'
type NodeInfoProps = {
  trigger: ReactNode
  node: APIDao.WebEndPointsNodeNodeListVo
}

export default function NodeInfo({trigger, node}: NodeInfoProps) {
  return (
    <Popup trigger={trigger} height={'80vh'}>
      <View style={[a.p_lg]}>
        <View style={[a.py_xs]}>
          <Text style={[a.text_lg, a.font_bold]}>节点</Text>
        </View>
        <View style={[a.flex_row, a.align_center, a.gap_xl, a.mt_2xl]}>
          <Image
            accessibilityIgnoresInvertColors
            style={[styles.logo]}
            source={{
              uri: extractAssetUrl(node.logo),
            }}
            alt=""
          />
          <Text style={[a.text_2xl]}>{node.name}</Text>
        </View>
        <View style={[a.my_xl, styles.spliter]} />
        <Text style={[a.text_md]}>{node.description}</Text>
      </View>
    </Popup>
  )
}

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80,
    borderRadius: '50%',
  },
  spliter: {
    height: 1,
    width: '100%',
    backgroundColor: '#d4dbe2',
  },
})
