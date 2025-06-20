import { TouchableWithoutFeedback, View } from 'react-native'
import { Image } from 'expo-image'
import { type AppBskyActorDefs } from "@atproto/api";
import { useNavigation } from "@react-navigation/native";

import { type NavigationProp } from "#/lib/routes/types";
import { type Shadow } from "#/state/cache/types";
import { atoms as a, useTheme, web } from '#/alf'
import { ArrowRight_Angle } from '#/components/icons/Arrow'
import { Text } from '#/components/Typography'
import { useRequest } from "ahooks";
import server from "#/server";
import OssImage from "#/components/OssImage";

export function ProfileHeaderMedal({
                                     profile
                                   }: {
  profile: Shadow<AppBskyActorDefs.ProfileViewDetailed>
}) {
  const t = useTheme()
  const navigation = useNavigation<NavigationProp>()
  const { data: medals } = useRequest(async () => {
    const result = await server.dao('POST /user-medal/page', {
      pageNum: 1,
      pageSize: 3,
    })
    return result?.items.filter(m => !!m.getTime)
  })


  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.push('MedalsWall', { name: profile.handle })
      }}
      testID={'profileModal'}
      accessibilityLabel={''}
      accessibilityHint=""
      accessibilityLabelledBy="list-description"
    >
      <View style={[a.flex_row, a.align_center, a.pt_xs]}>
        <Text style={[a.text_md, t.atoms.text_contrast_medium]}>勋章</Text>
        <View style={[a.ml_md, a.flex_row, a.gap_2xs, a.align_center]}>
          {medals?.map((md) => {
            return <OssImage
              key={md.medalId}
              style={[{ width: 16 }, { aspectRatio: 1 }]}
              attachId={md.attachId}
            />
          })}
        </View>
        <ArrowRight_Angle
          fill={'#6F869F'}
          style={[a.ml_xs]}
          size={'xs'}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}
