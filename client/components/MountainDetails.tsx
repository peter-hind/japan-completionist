import { climbMountain, getClimberMountains } from '../api/mountainApi.ts'
import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Mountain from '../../models/mountain.ts'

interface Props {
  featureData: Mountain
}

function MountainDetails({ featureData }: Props) {
  const { user } = useAuth0()
  const queryClient = useQueryClient()

  const { data: mountainList, isLoading } = useQuery({
    queryKey: ['currentmountains'],
    queryFn: () => getClimberMountains(user?.sub as string),
  })

  const climbMountainMutation = useMutation({
    mutationFn: (peakId: number) => climbMountain(user?.sub as string, peakId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentmountains'] })
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      {featureData ? (
        <>
          <h2>Mountain Details</h2>
          <div className="feature-container">
            <div className="feature-box">
              <div className="feature-icon">⛰️</div>
              <h3>Mountain Name:</h3>
              {featureData.name}
            </div>
            <div className="feature-box">
              <div className="feature-icon">🗺️</div>
              <h3>Prefecture:</h3>
              {featureData.prefecture}
            </div>
            <div className="feature-box">
              <div className="feature-icon">🔝</div>
              <h3>Elevation:</h3>
              {featureData.elevation_m}m
            </div>

            <div className="feature-box">
              <div className="feature-icon">📒</div>
              <h3>Description:</h3>
              {featureData.description}
            </div>
          </div>
          {user ? (
            <div>
              <div className="checkoff-box">
                <h3>Climbed?</h3>

                {mountainList?.some(
                  (mountain: any) => Number(mountain.peak_id) === featureData.id
                ) ? (
                  <div className="feature-icon climbed">✅</div>
                ) : (
                  <>
                    <div className="feature-icon not-climbed">❌</div>
                    <button
                      className="login-button"
                      onClick={() =>
                        climbMountainMutation.mutate(featureData.id)
                      }
                    >
                      Climbed?
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <h2>Select a Mountain</h2>
      )}
    </div>
  )
}

export default MountainDetails
