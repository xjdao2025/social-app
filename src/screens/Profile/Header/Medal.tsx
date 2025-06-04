import {TouchableWithoutFeedback, View} from 'react-native'
import {Image} from 'expo-image'

import {atoms as a, useTheme, web} from '#/alf'
import {ArrowRight_Angle} from '#/components/icons/Arrow'
import {Text} from '#/components/Typography'

export function ProfileHeaderMedal() {
  const t = useTheme()
  const url =
    'https://bsky.rivtower.cc/img/avatar/plain/did:plc:nxdyljvilqrbiugen6nfb2pu/bafkreiamzuag5kh6ron3lfrc6lzjd4z5b3z75x7vooy5nolmuptrowbx7a@jpeg'

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        console.log('press>>>>勋章')
      }}
      testID={'profileModal'}
      accessibilityLabel={''}
      accessibilityHint=""
      accessibilityLabelledBy="list-description">
      <View style={[a.flex_row, a.align_center, a.pt_xs]}>
        <Text style={[a.text_md, t.atoms.text_contrast_medium]}>勋章</Text>
        <View style={[a.ml_md, a.flex_row, a.gap_2xs, a.align_center]}>
          <Image
            accessibilityIgnoresInvertColors
            style={[{width: 16}, {aspectRatio: 1}]}
            source={{uri: url}}
          />
          <Image
            accessibilityIgnoresInvertColors
            style={[{width: 16}, {aspectRatio: 1}]}
            source={{uri: url}}
          />
        </View>
        <ArrowRight_Angle fill={'#6F869F'} style={[a.ml_xs]} size={'xs'} />
      </View>
    </TouchableWithoutFeedback>
  )
}
