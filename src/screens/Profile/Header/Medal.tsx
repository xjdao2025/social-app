import {TouchableWithoutFeedback, View} from 'react-native'
import {Image} from 'expo-image'
import  { type AppBskyActorDefs } from "@atproto/api";
import { useNavigation } from "@react-navigation/native";

import  { type NavigationProp } from "#/lib/routes/types";
import  { type Shadow } from "#/state/cache/types";
import {atoms as a, useTheme, web} from '#/alf'
import {ArrowRight_Angle} from '#/components/icons/Arrow'
import {Text} from '#/components/Typography'

export function ProfileHeaderMedal({
    profile
  }: {
  profile: Shadow<AppBskyActorDefs.ProfileViewDetailed>
}) {
  const t = useTheme()
  const navigation = useNavigation<NavigationProp>()
  const url =
    'https://bsky.rivtower.cc/img/avatar/plain/did:plc:nxdyljvilqrbiugen6nfb2pu/bafkreiamzuag5kh6ron3lfrc6lzjd4z5b3z75x7vooy5nolmuptrowbx7a@jpeg'

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.push('MedalsWall', { name: profile.handle })
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
